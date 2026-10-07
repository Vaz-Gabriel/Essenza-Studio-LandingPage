document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DO MENU E SCROLL --- //
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const closeMenuBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        if(mobileMenu) mobileMenu.classList.toggle('active');
        if(mobileOverlay) mobileOverlay.classList.toggle('active');
    }

    if(mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
    if(closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
    if(mobileOverlay) mobileOverlay.addEventListener('click', toggleMenu);
    
    if(mobileLinks) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // --- SCROLL SUAVE PARA LINKS ÂNCORA --- //
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Considera a altura do header fixo
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- LÓGICA DE ANIMAÇÕES REVEAL (Intersection Observer) --- //
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // --- LÓGICA DO FORMULÁRIO DE NEWSLETTER E POPUP COM EMAILJS --- //
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');
    
    // Elementos do Popup de Sucesso
    const popup = document.getElementById('emailPopup');
    const popupEmailText = document.getElementById('popupEmailText');
    const closeBtn1 = document.getElementById('closePopupBtn');
    const closeBtn2 = document.getElementById('closePopupBtn2');

    // Elementos do Popup de Erro
    const errorPopup = document.getElementById('errorPopup');
    const closeErrorBtn1 = document.getElementById('closeErrorPopupBtn');
    const closeErrorBtn2 = document.getElementById('closeErrorPopupBtn2');

    function closePopups() {
        popup.classList.remove('active');
        errorPopup.classList.remove('active');
    }

    if (closeBtn1) closeBtn1.addEventListener('click', closePopups);
    if (closeBtn2) closeBtn2.addEventListener('click', closePopups);
    if (closeErrorBtn1) closeErrorBtn1.addEventListener('click', closePopups);
    if (closeErrorBtn2) closeErrorBtn2.addEventListener('click', closePopups);

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão da página
            
            const emailValue = emailInput.value.trim();
            const submitBtn = document.getElementById('newsletter-submit');

            if (emailValue) {
                // Altera o estado do botão para mostrar carregamento
                const originalBtnContent = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;

                // Envia o e-mail usando EmailJS
                // NOTA: Estes IDs (YOUR_SERVICE_ID, YOUR_TEMPLATE_ID) precisam ser configurados na sua conta EmailJS
                emailjs.sendForm('service_r0qlznm', 'template_gwjp4bm', this)
                    .then(() => {
                        // Sucesso: Mostra o popup de confirmação
                        popupEmailText.textContent = emailValue;
                        popup.classList.add('active');
                        form.reset(); // Limpa o formulário
                    }, (error) => {
                        // Erro: Mostra o popup de erro
                        console.error('FAILED...', error);
                        errorPopup.classList.add('active');
                    })
                    .finally(() => {
                        // Restaura o botão
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.disabled = false;
                    });
            }
        });
    }
});