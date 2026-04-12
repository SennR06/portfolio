// js/OBJLoader.js
// Gebaseerd op de oude THREE.OBJLoader uit examples/js/loaders/OBJLoader.js

(function () {
  if (!window.THREE) {
    console.error('THREE not found, include three.min.js before OBJLoader.js');
    return;
  }

  const OBJLoader = function (manager) {
    this.manager = manager !== undefined ? manager : THREE.DefaultLoadingManager;
    this.materials = null;
    this.path = '';
    this.resourcePath = '';
  };

  OBJLoader.prototype = {

    constructor: OBJLoader,

    setPath: function (value) {
      this.path = value;
      return this;
    },

    setResourcePath: function (value) {
      this.resourcePath = value;
      return this;
    },

    load: function (url, onLoad, onProgress, onError) {
      const scope = this;

      const loader = new THREE.FileLoader(this.manager);
      loader.setPath(this.path);
      loader.setResponseType('text');
      loader.load(
        url,
        function (text) {
          try {
            onLoad(scope.parse(text));
          } catch (e) {
            if (onError) onError(e);
            else console.error(e);
          }
        },
        onProgress,
        onError
      );
    },

    parse: function (text) {
      const object = new THREE.Group();
      let geometry, material, mesh;

      function addObject(name) {
        if (geometry && geometry.attributes.position && geometry.attributes.position.count > 0) {
          geometry.computeVertexNormals();
          mesh = new THREE.Mesh(geometry, material);
          mesh.name = name || '';
          object.add(mesh);
        }
        geometry = new THREE.BufferGeometry();
        vertices = [];
      }

      let vertices = [];
      geometry = new THREE.BufferGeometry();
      material = new THREE.MeshBasicMaterial();

      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.length === 0 || line.charAt(0) === '#') continue;

        const parts = line.split(/\s+/);
        const keyword = parts.shift();

        if (keyword === 'v') {
          vertices.push(
            parseFloat(parts[0]),
            parseFloat(parts[1]),
            parseFloat(parts[2])
          );
        } else if (keyword === 'f') {
          // Faces: we ignore details, we only need that it's a mesh
        } else if (keyword === 'o' || keyword === 'g') {
          addObject(parts.join(' '));
        }
      }

      if (vertices.length > 0) {
        const positionArray = new Float32Array(vertices);
        geometry.setAttribute(
          'position',
          new THREE.BufferAttribute(positionArray, 3)
        );
        addObject();
      }

      return object;
    }

  };

  THREE.OBJLoader = OBJLoader;
})();