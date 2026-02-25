document.addEventListener('DOMContentLoaded', function() {
    loadNavbar();
    loadHome();
    loadAbout();
    loadExperience();
    loadBusiness();
    loadContact();
    loadFooter();
    
    setTimeout(() => {
        initHamburger();
        initActiveLink();
        initSmoothScroll();
        initForm();
        initSocialLinks();
        initGroupPopup();
        initScrollToTop();
        fixNavbarOverflow();
    }, 100);
});

// ===== LOAD NAVBAR =====
function loadNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    navbar.innerHTML = `
        <div class="nama">
            <h1>My Portofolio</h1>
        </div>
        
        <div class="main-menu">
            <a href="#home" class="active"><i class="fas fa-home"></i> <span>Home</span></a>
            <a href="#about"><i class="far fa-user"></i> <span>About</span></a>
            <a href="#experience"><i class="fas fa-briefcase"></i> <span>Experience</span></a>
            <a href="#business"><i class="fas fa-store"></i> <span>Business</span></a>
            <a href="#contact"><i class="far fa-envelope"></i> <span>Contact</span></a>
        </div>
        
        <div class="hamburger-wrapper">
            <div class="hamburger" id="hamburger" aria-label="Menu" role="button" tabindex="0">
                <i class="fas fa-bars"></i>
                <span class="hamburger-text">Menu</span>
            </div>
            <div class="dropdown-menu" id="dropdownMenu"></div>
        </div>
    `;
    
    loadDropdownItems();
}

// ===== LOAD DROPDOWN ITEMS =====
function loadDropdownItems() {
    const dropdown = document.getElementById('dropdownMenu');
    if (!dropdown) return;
    
    const items = [
        { icon: 'fas fa-home', text: 'Home', href: '#home' },
        { icon: 'fas fa-user', text: 'About', href: '#about' },
        { icon: 'fas fa-briefcase', text: 'Experience', href: '#experience' },
        { icon: 'fas fa-store', text: 'Business', href: '#business' },
        { icon: 'fas fa-envelope', text: 'Contact', href: '#contact' },
        { divider: true },
        { icon: 'fas fa-cog', text: 'Pengaturan', href: '#' },
        { icon: 'fas fa-question-circle', text: 'Bantuan', href: '#' },
        { icon: 'fas fa-share-alt', text: 'Bagikan', href: '#' }
    ];
    
    dropdown.innerHTML = items.map(item => {
        if (item.divider) return '<div class="dropdown-divider"></div>';
        return `<a href="${item.href}"><i class="${item.icon}"></i> ${item.text}</a>`;
    }).join('');
}

// ===== FIX NAVBAR OVERFLOW =====
function fixNavbarOverflow() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    const checkWidth = () => {
        const nama = document.querySelector('.nama');
        const mainMenu = document.querySelector('.main-menu');
        const hamburger = document.querySelector('.hamburger-wrapper');
        
        if (!nama || !mainMenu || !hamburger) return;
        
        const navbarWidth = navbar.offsetWidth;
        const totalWidth = nama.offsetWidth + mainMenu.offsetWidth + hamburger.offsetWidth;
        const gap = parseInt(window.getComputedStyle(navbar).gap) || 0;
        const totalWithGap = totalWidth + (gap * 2);
        
        if (totalWithGap > navbarWidth) {
            // Terapkan perbaikan ekstrim
            if (window.innerWidth <= 420) {
                document.querySelector('.nama h1').style.maxWidth = '70px';
                document.querySelectorAll('.main-menu a').forEach(a => {
                    a.style.padding = '0.2rem 0.2rem';
                });
            }
        }
    };
    
    checkWidth();
    window.addEventListener('resize', checkWidth);
}

// ===== INIT HAMBURGER =====
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const dropdown = document.getElementById('dropdownMenu');
    
    if (!hamburger || !dropdown) return;
    
    let overlay = document.querySelector('.dropdown-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'dropdown-overlay';
        document.body.appendChild(overlay);
    }
    
    function closeDropdown() {
        dropdown.classList.remove('show');
        hamburger.classList.remove('active');
        overlay.classList.remove('show');
        
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
    }
    
    function openDropdown() {
        dropdown.classList.add('show');
        hamburger.classList.add('active');
        overlay.classList.add('show');
        
        const icon = hamburger.querySelector('i');
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
        
        if (window.innerWidth <= 768) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        }
    }
    
    hamburger.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        dropdown.classList.contains('show') ? closeDropdown() : openDropdown();
    });
    
    overlay.addEventListener('click', closeDropdown);
    
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !dropdown.contains(e.target)) {
            closeDropdown();
        }
    });
    
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    closeDropdown();
                    
                    if (document.body.style.position === 'fixed') {
                        const scrollY = document.body.style.top;
                        document.body.style.position = '';
                        document.body.style.top = '';
                        window.scrollTo(0, parseInt(scrollY || '0') * -1);
                    }
                    
                    setTimeout(() => {
                        const offsetTop = targetSection.offsetTop - 80;
                        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                        history.pushState(null, null, href);
                    }, 150);
                }
            } else {
                closeDropdown();
            }
        });
    });
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            if (window.innerWidth > 768 && dropdown.classList.contains('show')) {
                closeDropdown();
            }
        }, 250);
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dropdown.classList.contains('show')) {
            closeDropdown();
        }
    });
}

// ===== LOAD HOME =====
function loadHome() {
    const home = document.querySelector('#home');
    if (!home) return;
    
    home.innerHTML = `
        <div class="box home-box">
            <div class="myname">
                <h1>Eka Restu Syahputra</h1>
                <div class="keterangan">
                    <h2>Student & Tech Enthusiast</h2>
                    <p>I'm a student who is passionate about technology and programming. I enjoy learning new things and exploring the world of coding. In my free time, I like to work on personal projects and improve my skills in web development.</p>
                </div>
                
                <div class="mini-contact">
                    <a href="https://github.com/kaarlyz" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i> GitHub</a>
                    <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i> LinkedIn</a>
                    <a href="https://wa.me/6285177542325" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                </div>
            </div>

            <div class="profile">
                <img src="images/icon.jpeg" alt="Foto profil Eka Restu">
            </div>
        </div>
    `;
}

// ===== LOAD ABOUT =====
function loadAbout() {
    const about = document.querySelector('#about');
    if (!about) return;
    
    about.innerHTML = `
        <div class="box about-box">
            <div class="section-title">
                <h1>About Me</h1>
                <div class="title-line"></div>
            </div>
            
            <div class="about-stats">
                <div class="stat-item">
                    <div class="stat-number">2+</div>
                    <div class="stat-label">Years of Learning</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">10+</div>
                    <div class="stat-label">Personal Projects</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">3</div>
                    <div class="stat-label">Digital Businesses</div>
                </div>
            </div>
            
            <div class="about-bio">
                <div class="about-bio-img">
                    <img src="images/about-icon.jpeg" alt="Eka Restu Syahputra">
                </div>
                <div class="about-bio-text">
                    <h3><i class="fas fa-user-graduate"></i> Eka Restu Syahputra</h3>
                    <p class="bio-quote">"Consistency over perfection"</p>
                    <p>I believe growth happens through consistency. Every single day, I push myself to learn something new, improve my skills, and become better than I was yesterday.</p>
                    <p>I'm not chasing perfection. I'm focused on progress — building discipline, strengthening my problem-solving mindset, and developing the habits that will shape me into a reliable developer in the future.</p>
                    <div class="bio-tags">
                        <span class="badge">#AlwaysLearning</span>
                        <span class="badge">#CuriousMind</span>
                        <span class="badge">#HealthyLifestyle</span>
                    </div>
                </div>
            </div>
            
            <div class="about-grid">
                <div class="about-card">
                    <div class="about-card-header">
                        <i class="fas fa-address-card"></i>
                        <h3>Personal Info</h3>
                    </div>
                    <div class="about-card-content">
                        <div class="about-card-item">
                            <i class="fas fa-graduation-cap"></i>
                            <span class="label">Education</span>
                            <span class="value">SMA Swasta Teladan Medan</span>
                        </div>
                        <div class="about-card-item">
                            <i class="fas fa-heart"></i>
                            <span class="label">Interests</span>
                            <span class="value">Running, Nutrition, Self-Improvement, Tinkering</span>
                        </div>
                        <div class="about-card-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span class="label">Location</span>
                            <span class="value">Medan, Indonesia</span>
                        </div>
                        <div class="about-card-item">
                            <i class="fas fa-language"></i>
                            <span class="label">Languages</span>
                            <span class="value">Indonesian, English (Basic)</span>
                        </div>
                    </div>
                </div>
                
                <div class="about-card">
                    <div class="about-card-header">
                        <i class="fas fa-code"></i>
                        <h3>Tech Stack</h3>
                    </div>
                    <div class="about-card-content">
                        <div class="about-card-item">
                            <i class="fab fa-html5"></i>
                            <span class="label">HTML</span>
                            <span class="value">Intermediate</span>
                        </div>
                        <div class="about-card-item">
                            <i class="fab fa-css3-alt"></i>
                            <span class="label">CSS</span>
                            <span class="value">Intermediate</span>
                        </div>
                        <div class="about-card-item">
                            <i class="fab fa-js"></i>
                            <span class="label">JavaScript</span>
                            <span class="value">Basic</span>
                        </div>
                        <div class="about-card-item">
                            <i class="fas fa-tools"></i>
                            <span class="label">Tools</span>
                            <span class="value">VS Code, Git</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="about-skills">
                <h3><i class="fas fa-cog"></i> Skills & Expertise</h3>
                <div class="skills-cloud">
                    <span class="skill-tag"><i class="fab fa-html5"></i> HTML5</span>
                    <span class="skill-tag"><i class="fab fa-css3-alt"></i> CSS3</span>
                    <span class="skill-tag"><i class="fab fa-js"></i> JavaScript</span>
                    <span class="skill-tag"><i class="fas fa-database"></i> MySQL (Basic)</span>
                    <span class="skill-tag"><i class="fab fa-git-alt"></i> Git</span>
                    <span class="skill-tag"><i class="fas fa-mobile-alt"></i> Responsive Design</span>
                    <span class="skill-tag"><i class="fas fa-bolt"></i> Problem Solving</span>
                    <span class="skill-tag"><i class="fas fa-microscope"></i> Tinkering</span>
                </div>
            </div>
            
            <div class="about-interests">
                <div class="interest-item"><i class="fas fa-running"></i><span>Running</span></div>
                <div class="interest-item"><i class="fas fa-leaf"></i><span>Nutrition</span></div>
                <div class="interest-item"><i class="fas fa-laptop-code"></i><span>Coding</span></div>
                <div class="interest-item"><i class="fas fa-book"></i><span>Self-Improvement</span></div>
                <div class="interest-item"><i class="fas fa-microscope"></i><span>Tinkering</span></div>
            </div>

            <div class="about-books">
                <h3><i class="fas fa-book-reader"></i> Currently Reading</h3>
                <div class="books-list">
                    <div class="book-item">
                        <i class="fas fa-book-open"></i>
                        <div class="book-info">
                            <span class="book-title">Atomic Habits</span>
                            <span class="book-author">James Clear</span>
                        </div>
                    </div>
                    <div class="book-item">
                        <i class="fas fa-book-open"></i>
                        <div class="book-info">
                            <span class="book-title">The Power of Now</span>
                            <span class="book-author">Eckhart Tolle</span>
                        </div>
                    </div>
                    <div class="book-item">
                        <i class="fas fa-book-open"></i>
                        <div class="book-info">
                            <span class="book-title">Mindset</span>
                            <span class="book-author">Carol Dweck</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ===== LOAD EXPERIENCE =====
function loadExperience() {
    const exp = document.querySelector('#experience');
    if (!exp) return;
    
    exp.innerHTML = `
        <div class="box experience-box">
            <div class="section-title">
                <h1>Professional Experience</h1>
                <div class="title-line"></div>
            </div>
            
            <div class="experience-grid">
                <div class="exp-card">
                    <div class="exp-icon"><i class="fab fa-whatsapp"></i></div>
                    <h3>Automation Engineer</h3>
                    <p class="exp-desc">Developed and managed WhatsApp-based automation systems for business workflows. Successfully served hundreds of users daily with reliable information services and automated responses.</p>
                </div>
                
                <div class="exp-card">
                    <div class="exp-icon"><i class="fas fa-store"></i></div>
                    <h3>Founder & Business Lead</h3>
                    <p class="exp-desc">Founded and scaled KIKA Digital from ground up. Oversaw business strategy, daily operations, and product development across multiple digital service verticals.</p>
                </div>
                
                <div class="exp-card">
                    <div class="exp-icon"><i class="fas fa-handshake"></i></div>
                    <h3>Escrow Service Administrator</h3>
                    <p class="exp-desc">Managed secure transaction facilitation as a trusted third-party mediator. Ensured safe exchanges between buyers and sellers across various online communities.</p>
                </div>
            </div>
        </div>
    `;
}

// ===== LOAD BUSINESS =====
function loadBusiness() {
    const business = document.querySelector('#business');
    if (!business) return;
    
    business.innerHTML = `
        <div class="box business-box">
            <div class="section-title">
                <h1>Business Portfolio</h1>
                <div class="title-line"></div>
            </div>
            
            <div class="business-container">
                <div class="business-main-card">
                    <div class="business-header">
                        <img src="images/kika.png" alt="KIKA Logo" class="business-main-logo">
                        <h2>KIKA Digital</h2>
                    </div>
                    
                    <div class="business-content">
                        <div class="business-item">
                            <i class="fas fa-handshake"></i>
                            <div>
                                <h4>Escrow Service (Rekber)</h4>
                                <p>Secure transaction facilitation for online marketplace. Trusted by hundreds of clients.</p>
                            </div>
                        </div>
                        <div class="business-item">
                            <i class="fas fa-shield-alt"></i>
                            <div>
                                <h4>Account Security Service</h4>
                                <p>Account protection for games, social media, and email. 2FA setup and consultation.</p>
                            </div>
                        </div>
                        <div class="business-item">
                            <i class="fas fa-boxes"></i>
                            <div>
                                <h4>Game Account Marketplace</h4>
                                <p>Verified ML, FF, PUBG accounts. Competitive pricing with security guarantee.</p>
                            </div>
                        </div>
                        <div class="business-item">
                            <i class="fas fa-coins"></i>
                            <div>
                                <h4>Game Top-up & Vouchers</h4>
                                <p>Fast and reliable top-up for Mobile Legends, Free Fire, and other games.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="business-links">
                        <h4>Join Community / Order:</h4>
                        <div class="link-group">
                            <a href="#" class="business-link group-wa-btn"><i class="fab fa-whatsapp"></i> WhatsApp Group</a>
                            <a href="#" class="business-link"><i class="fab fa-telegram"></i> Telegram Channel</a>
                            <a href="#" class="business-link"><i class="fas fa-shopping-cart"></i> Catalog</a>
                        </div>
                    </div>
                </div>
                
                <div class="business-main-card">
                    <div class="business-header">
                        <i class="fas fa-microchip business-main-icon"></i>
                        <h2>TechLab Solutions</h2>
                    </div>
                    
                    <div class="business-content">
                        <div class="business-item">
                            <i class="fas fa-laptop-code"></i>
                            <div>
                                <h4>Laptop Repair & Maintenance</h4>
                                <p>Professional laptop servicing including OS installation, cleaning, and upgrades.</p>
                            </div>
                        </div>
                        <div class="business-item">
                            <i class="fas fa-mobile-alt"></i>
                            <div>
                                <h4>Smartphone Repair</h4>
                                <p>LCD replacement, battery change, flashing service, and repairs.</p>
                            </div>
                        </div>
                        <div class="business-item">
                            <i class="fas fa-code"></i>
                            <div>
                                <h4>Coding Assistance</h4>
                                <p>Basic web development help (HTML, CSS, JavaScript). Perfect for beginners.</p>
                            </div>
                        </div>
                        <div class="business-item">
                            <i class="fas fa-desktop"></i>
                            <div>
                                <h4>PC Building & Consultation</h4>
                                <p>Custom PC assembly service with component recommendations.</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="business-links">
                        <h4>Contact & Support:</h4>
                        <div class="link-group">
                            <a href="#" class="business-link"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                            <a href="#" class="business-link"><i class="fas fa-envelope"></i> Email</a>
                            <a href="#" class="business-link"><i class="fas fa-map-marker-alt"></i> Location</a>
                        </div>
                    </div>
                    
                    <div class="business-status-wrapper">
                        <span class="business-status active">Currently Open</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    addGroupModal();
}

// ===== ADD GROUP MODAL =====
function addGroupModal() {
    if (document.getElementById('groupModal')) return;
    
    const modalHTML = `
        <div class="modal-overlay" id="groupModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fab fa-whatsapp"></i> Pilih Grup WhatsApp</h3>
                    <button class="modal-close" aria-label="Close">&times;</button>
                </div>
                <div class="modal-groups" id="groupList">
                    <div class="loading-spinner">Loading...</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// ===== INIT GROUP POPUP =====
function initGroupPopup() {
    const groupBtn = document.querySelector('.group-wa-btn');
    const modal = document.getElementById('groupModal');
    const closeBtn = document.querySelector('.modal-close');
    const groupList = document.getElementById('groupList');
    
    if (!groupBtn || !modal || !closeBtn || !groupList) return;
    
    const groups = [
        { name: 'Grup Jualan 1', description: 'Grup utama jualan pulsa & kuota', link: 'https://chat.whatsapp.com/DT1C5Pai43WGvjHO6ZGUNn?mode=gi_t', members: '1.2k' },
        { name: 'Grup Jualan 2', description: 'Grup thrifting & fashion', link: '#', members: '850' },
        { name: 'Grup Jualan 3', description: 'Grup top-up game & voucher', link: '#', members: '2.1k' },
        { name: 'Grup Jualan 4', description: 'Grup jasa rekber & pengamanan', link: '#', members: '500' },
        { name: 'Grup Jualan 5', description: 'Grup stock akun game', link: '#', members: '1.5k' }
    ];
    
    setTimeout(() => {
        groupList.innerHTML = groups.map(group => `
            <div class="group-item" data-link="${group.link}" role="button" tabindex="0">
                <i class="fab fa-whatsapp"></i>
                <div class="group-info">
                    <h4>${group.name}</h4>
                    <p>${group.description}</p>
                    <small><i class="fas fa-users"></i> ${group.members} members</small>
                </div>
                <i class="fas fa-chevron-right"></i>
            </div>
        `).join('');
        
        document.querySelectorAll('.group-item').forEach(item => {
            item.addEventListener('click', function() {
                const link = this.dataset.link;
                if (link && link !== '#') window.open(link, '_blank');
            });
        });
    }, 300);
    
    groupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    });
    
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
}

// ===== LOAD CONTACT =====
function loadContact() {
    const contact = document.querySelector('#contact');
    if (!contact) return;
    
    contact.innerHTML = `
        <div class="box contact-box">
            <div class="contact-content">
                <div class="section-title">
                    <h1>Get in Touch</h1>
                    <div class="title-line"></div>
                </div>
                
                <div class="mini-contact contact-social">
                    <a href="https://github.com/kaarlyz" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i> GitHub</a>
                    <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i> LinkedIn</a>
                    <a href="https://wa.me/6285177542325" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i> WhatsApp</a>
                </div>
                
                <div class="contact-email">
                    <p><i class="far fa-envelope"></i> ekarestusyahputra.id@gmail.com</p>
                </div>
                
                <div class="contact-form">
                    <h2><i class="far fa-paper-plane"></i> Kirim Pesan</h2>
                    
                    <form id="contactForm" novalidate>
                        <div class="form-group">
                            <input type="text" id="name" name="name" placeholder="Nama kamu" required>
                            <small class="error-message"></small>
                        </div>
                        <div class="form-group">
                            <input type="email" id="email" name="email" placeholder="Email kamu" required>
                            <small class="error-message"></small>
                        </div>
                        <div class="form-group">
                            <textarea id="message" name="message" rows="4" placeholder="Pesan kamu..." required></textarea>
                            <small class="error-message"></small>
                        </div>
                        <button type="submit" id="sendBtn">
                            <i class="far fa-paper-plane"></i> 
                            <span>Kirim Pesan</span>
                            <div class="spinner" style="display: none;"></div>
                        </button>
                    </form>
                    <div id="formFeedback" class="form-feedback"></div>
                </div>
            </div>
        </div>
    `;
}

// ===== LOAD FOOTER =====
function loadFooter() {
    const footer = document.querySelector('.foot-note');
    if (!footer) return;
    
    footer.innerHTML = `
        <div class="footer-content">
            <p class="footer-copyright">© 2026 Eka Restu Syahputra. All rights reserved.</p>
            <div class="footer-links">
                <a href="https://github.com/kaarlyz" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>
                <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
                <a href="https://wa.me/6285177542325" target="_blank" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                <a href="#home" id="scrollToTop" aria-label="Scroll to top"><i class="fas fa-chevron-up"></i></a>
            </div>
        </div>
    `;
    
    initScrollToTop();
}

// ===== INIT ACTIVE LINK =====
function initActiveLink() {
    const sections = document.querySelectorAll('section');
    const mainMenuLinks = document.querySelectorAll('.main-menu a');
    
    function setActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                current = section.getAttribute('id');
            }
        });
        
        mainMenuLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href').substring(1);
            if (href === current) link.classList.add('active');
        });
    }
    
    window.addEventListener('scroll', setActiveLink);
    setActiveLink();
}

// ===== INIT SMOOTH SCROLL =====
function initSmoothScroll() {
    const links = document.querySelectorAll('.main-menu a, .dropdown-menu a');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(href);
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                    history.pushState(null, null, href);
                }
            }
        });
    });
}

// ===== INIT FORM =====
function initForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const sendBtn = document.getElementById('sendBtn');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const feedback = document.getElementById('formFeedback');
    
    if (!sendBtn || !nameInput || !emailInput || !messageInput || !feedback) return;
    
    const spinner = sendBtn.querySelector('.spinner');
    const btnText = sendBtn.querySelector('span');
    
    function validateField(field, showMessage = false) {
        const formGroup = field.closest('.form-group');
        const oldError = formGroup?.querySelector('.error-message');
        if (oldError) oldError.remove();
        
        field.classList.remove('error', 'success');
        
        if (field.id === 'name' && field.value.trim() === '') {
            if (showMessage) {
                field.classList.add('error');
                addErrorMessage(formGroup, 'Nama tidak boleh kosong');
            }
            return false;
        }
        
        if (field.id === 'email') {
            if (field.value.trim() === '') {
                if (showMessage) {
                    field.classList.add('error');
                    addErrorMessage(formGroup, 'Email tidak boleh kosong');
                }
                return false;
            } else if (!isValidEmail(field.value)) {
                if (showMessage) {
                    field.classList.add('error');
                    addErrorMessage(formGroup, 'Email tidak valid');
                }
                return false;
            }
        }
        
        if (field.id === 'message' && field.value.trim() === '') {
            if (showMessage) {
                field.classList.add('error');
                addErrorMessage(formGroup, 'Pesan tidak boleh kosong');
            }
            return false;
        }
        
        if (field.value.trim() !== '') field.classList.add('success');
        return true;
    }
    
    function addErrorMessage(formGroup, message) {
        if (!formGroup) return;
        const errorMsg = document.createElement('small');
        errorMsg.className = 'error-message';
        errorMsg.textContent = message;
        errorMsg.style.cssText = 'color: #b00020; display: block; margin-top: 5px; font-size: 0.85rem; animation: slideDown 0.3s ease;';
        formGroup.appendChild(errorMsg);
    }
    
    sendBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const isNameValid = validateField(nameInput, true);
        const isEmailValid = validateField(emailInput, true);
        const isMessageValid = validateField(messageInput, true);
        
        if (!isNameValid || !isEmailValid || !isMessageValid) {
            feedback.innerHTML = '❌ Mohon isi semua field dengan benar';
            feedback.style.color = '#b00020';
            return;
        }
        
        sendBtn.disabled = true;
        if (spinner) spinner.style.display = 'inline-block';
        if (btnText) btnText.textContent = 'Mengirim...';
        feedback.innerHTML = '⏳ Mengirim pesan...';
        feedback.style.color = '#0f371f';
        
        try {
            const response = await fetch('https://formspree.io/f/mrearjon', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name: nameInput.value,
                    email: emailInput.value,
                    message: messageInput.value,
                    _replyto: emailInput.value,
                    _subject: `Pesan Portfolio dari ${nameInput.value}`
                })
            });
            
            if (response.ok) {
                feedback.innerHTML = '✅ Pesan terkirim! Terima kasih!';
                feedback.style.color = '#0f371f';
                contactForm.reset();
                [nameInput, emailInput, messageInput].forEach(input => input.classList.remove('success', 'error'));
                document.querySelectorAll('.error-message').forEach(el => el.remove());
            } else {
                throw new Error('Gagal mengirim');
            }
        } catch (error) {
            feedback.innerHTML = '❌ Gagal mengirim. Coba lagi atau hubungi WA.';
            feedback.style.color = '#b00020';
        } finally {
            sendBtn.disabled = false;
            if (spinner) spinner.style.display = 'none';
            if (btnText) btnText.textContent = 'Kirim Pesan';
            
            setTimeout(() => {
                feedback.style.transition = 'opacity 0.3s';
                feedback.style.opacity = '0';
                setTimeout(() => {
                    feedback.innerHTML = '';
                    feedback.style.opacity = '1';
                    feedback.style.transition = '';
                }, 300);
            }, 5000);
        }
    });
    
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// ===== INIT SOCIAL LINKS =====
function initSocialLinks() {
    document.querySelectorAll('.mini-contact a[href="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const toast = document.createElement('div');
            toast.innerHTML = '🔗 Link akan diisi segera';
            toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:white;padding:12px 24px;border-radius:50px;font-size:14px;z-index:9999;animation:slideUp 0.3s ease;';
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'slideDown 0.3s ease';
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        });
    });
}

// ===== INIT SCROLL TO TOP =====
function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        scrollBtn.style.opacity = window.scrollY > 300 ? '1' : '0.5';
    });
    
    scrollBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}