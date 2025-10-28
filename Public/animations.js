// ========================================
// 動畫和交互效果管理
// ========================================

class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupFormAnimations();
        this.setupButtonAnimations();
        this.setupNotificationAnimations();
        this.setupPageTransitions();
    }

    // 滾動動畫
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // 觀察所有需要動畫的元素
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }

    // 表單動畫
    setupFormAnimations() {
        // 表單驗證動畫
        document.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', (e) => {
                this.animateFormField(e.target);
            });

            input.addEventListener('input', (e) => {
                this.handleFormInput(e.target);
            });
        });

        // 複選框動畫
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.animateCheckbox(e.target);
            });
        });
    }

    // 按鈕動畫
    setupButtonAnimations() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.animateButtonClick(e.target);
            });

            button.addEventListener('mouseenter', (e) => {
                this.animateButtonHover(e.target, true);
            });

            button.addEventListener('mouseleave', (e) => {
                this.animateButtonHover(e.target, false);
            });
        });
    }

    // 通知動畫
    setupNotificationAnimations() {
        // 監聽通知創建
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('notification')) {
                        this.animateNotification(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 頁面轉場動畫
    setupPageTransitions() {
        // 頁面載入動畫
        window.addEventListener('load', () => {
            this.animatePageLoad();
        });

        // 鏈接點擊動畫
        document.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', (e) => {
                if (this.isInternalLink(link.href)) {
                    this.animatePageExit();
                }
            });
        });
    }

    // 表單字段動畫
    animateFormField(field) {
        const isValid = field.checkValidity();
        const isEmpty = field.value.trim() === '';

        if (!isEmpty) {
            if (isValid) {
                field.classList.add('success');
                field.classList.remove('error');
            } else {
                field.classList.add('error');
                field.classList.remove('success');
            }
        } else {
            field.classList.remove('success', 'error');
        }
    }

    // 表單輸入處理
    handleFormInput(field) {
        // 實時驗證動畫
        if (field.value.trim() !== '') {
            field.classList.add('has-content');
        } else {
            field.classList.remove('has-content');
        }
    }

    // 複選框動畫
    animateCheckbox(checkbox) {
        const checkmark = checkbox.nextElementSibling;
        if (checkmark && checkmark.classList.contains('checkmark')) {
            checkmark.style.transform = 'scale(1.2)';
            setTimeout(() => {
                checkmark.style.transform = 'scale(1)';
            }, 150);
        }
    }

    // 按鈕點擊動畫
    animateButtonClick(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
    }

    // 按鈕懸停動畫
    animateButtonHover(button, isHovering) {
        if (isHovering) {
            button.style.transform = 'translateY(-2px)';
        } else {
            button.style.transform = 'translateY(0)';
        }
    }

    // 通知動畫
    animateNotification(notification) {
        // 顯示動畫
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // 自動移除
        setTimeout(() => {
            notification.classList.add('removing');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 頁面載入動畫
    animatePageLoad() {
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('page-enter');
        }

        // 延遲動畫元素
        const animatedElements = document.querySelectorAll('.form-section, .info-card, .course-card');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in-up');
            }, index * 100);
        });
    }

    // 頁面退出動畫
    animatePageExit() {
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('page-exit');
        }
    }

    // 檢查是否為內部鏈接
    isInternalLink(href) {
        return href.startsWith(window.location.origin) || href.startsWith('/');
    }

    // 添加滾動動畫類
    addScrollAnimation(element) {
        element.classList.add('scroll-animate');
    }

    // 觸發自定義動畫
    triggerAnimation(element, animationClass) {
        element.classList.add(animationClass);
        setTimeout(() => {
            element.classList.remove(animationClass);
        }, 600);
    }

    // 創建載入動畫
    createLoadingAnimation(element) {
        element.classList.add('loading');
        return () => {
            element.classList.remove('loading');
        };
    }

    // 創建脈衝動畫
    createPulseAnimation(element) {
        element.style.animation = 'pulse 1s ease-in-out infinite';
        return () => {
            element.style.animation = '';
        };
    }

    // 創建搖擺動畫
    createShakeAnimation(element) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, 500);
    }
}

// ========================================
// 視覺回饋管理
// ========================================

class VisualFeedbackManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupFocusEffects();
        this.setupClickEffects();
    }

    // 懸停效果
    setupHoverEffects() {
        // 卡片懸停效果
        document.querySelectorAll('.info-card, .course-card, .course-preview-card').forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addHoverEffect(e.target);
            });

            card.addEventListener('mouseleave', (e) => {
                this.removeHoverEffect(e.target);
            });
        });

        // 按鈕懸停效果
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.addButtonHoverEffect(e.target);
            });

            button.addEventListener('mouseleave', (e) => {
                this.removeButtonHoverEffect(e.target);
            });
        });
    }

    // 聚焦效果
    setupFocusEffects() {
        document.querySelectorAll('input, select, textarea, button').forEach(element => {
            element.addEventListener('focus', (e) => {
                this.addFocusEffect(e.target);
            });

            element.addEventListener('blur', (e) => {
                this.removeFocusEffect(e.target);
            });
        });
    }

    // 點擊效果
    setupClickEffects() {
        document.querySelectorAll('.clickable, .btn, .nav-link').forEach(element => {
            element.addEventListener('click', (e) => {
                this.addClickEffect(e.target);
            });
        });
    }

    // 添加懸停效果
    addHoverEffect(element) {
        element.style.transform = 'translateY(-8px) scale(1.02)';
        element.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    // 移除懸停效果
    removeHoverEffect(element) {
        element.style.transform = 'translateY(0) scale(1)';
        element.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    }

    // 添加按鈕懸停效果
    addButtonHoverEffect(button) {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
    }

    // 移除按鈕懸停效果
    removeButtonHoverEffect(button) {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
    }

    // 添加聚焦效果
    addFocusEffect(element) {
        element.style.outline = 'none';
        element.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        element.style.borderColor = '#667eea';
    }

    // 移除聚焦效果
    removeFocusEffect(element) {
        element.style.boxShadow = '';
        element.style.borderColor = '';
    }

    // 添加點擊效果
    addClickEffect(element) {
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 150);
    }

    // 顯示成功狀態
    showSuccessState(element) {
        element.classList.add('success');
        setTimeout(() => {
            element.classList.remove('success');
        }, 2000);
    }

    // 顯示錯誤狀態
    showErrorState(element) {
        element.classList.add('error');
        setTimeout(() => {
            element.classList.remove('error');
        }, 2000);
    }
}

// ========================================
// 初始化
// ========================================

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 初始化動畫管理器
    window.animationManager = new AnimationManager();
    
    // 初始化視覺回饋管理器
    window.visualFeedbackManager = new VisualFeedbackManager();
    
    // 添加頁面載入動畫
    document.body.classList.add('page-loaded');
    
    // 為動態添加的元素添加動畫類
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    // 為新添加的卡片添加動畫
                    if (node.classList && (
                        node.classList.contains('course-card') ||
                        node.classList.contains('info-card') ||
                        node.classList.contains('course-preview-card')
                    )) {
                        node.classList.add('fade-in-up');
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// ========================================
// 工具函數
// ========================================

// 創建通知
function createNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // 觸發動畫
    if (window.animationManager) {
        window.animationManager.animateNotification(notification);
    }
}

// 顯示載入狀態
function showLoading(element) {
    if (window.animationManager) {
        return window.animationManager.createLoadingAnimation(element);
    }
}

// 觸發動畫
function triggerAnimation(element, animationClass) {
    if (window.animationManager) {
        window.animationManager.triggerAnimation(element, animationClass);
    }
}

// 添加滾動動畫
function addScrollAnimation(element) {
    if (window.animationManager) {
        window.animationManager.addScrollAnimation(element);
    }
}

// 導出到全域
window.createNotification = createNotification;
window.showLoading = showLoading;
window.triggerAnimation = triggerAnimation;
window.addScrollAnimation = addScrollAnimation;
