document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const conformationMessage =
        document.getElementsByClassName('conformation-message')[0];

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // hCaptcha veld optioneel maken zodat je geen error krijgt
        // const hCaptchaField = form.querySelector(
        //     'textarea[name=h-captcha-response]'
        // );
        // const hCaptcha = hCaptchaField ? hCaptchaField.value : '';

        // if (hCaptchaField && !hCaptcha) {
        //     alert('Please fill out captcha field');
        //     return;
        // }

        const formData = new FormData(form);
        formData.append("access_key", "18bba8b1-f675-4f35-9b51-0000d6743cdb");

        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                if (conformationMessage) {
                    conformationMessage.classList.add('visible');
                }
                if (submitBtn) {
                    submitBtn.textContent = 'Back to the form';
                    submitBtn.disabled = false;

                    submitBtn.onclick = () => {
                        if (conformationMessage) {
                            conformationMessage.classList.remove('visible');
                        }
                        form.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.onclick = null;
                    };
                }
            } else {
                alert('Error: ' + data.message);
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
});