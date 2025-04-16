function fnMain() {

    Slider({
        container: ".carousel__inner",
        settings: {
            speed: 1200,
            prevArrow: `<button type="button" class="carousel__prev-arrow"><img src="icons/left.svg" alt="<"></button>`,
            nextArrow: `<button type="button" class="carousel__next-arrow"><img src="icons/right.svg" alt=">"></button>`,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        dots: true,
                        arrows: false
                    }
                }
            ]
        }
    });

    Tabs({
        container: "div.container",
        navBlock: "ul.catalog__tabs",
        contentBlock: "div.catalog__content",
        activeTab: ".catalog__tab_active",
        activeTabClass: "catalog__tab_active",
        activeContentBlockClass: "catalog__content_active"
    });

    ToggleCards({
        detailsLink: ".catalog-item__link",
        summaryLink: ".catalog-item__back",
        summaryBlock: ".catalog-item__content",
        summaryActiveClass: "catalog-item__content_active",
        detailsBlock: ".catalog-item__list",
        detailsActiveClass: "catalog-item__list_active"
    });

    ModalWindow({
        openButton: `[data-modal="consultation-window"]`,
        overlay: ".overlay",
        contentBlock: "#consultation-window",
        closeButton: ".modal__close"
    });

    OrderWindow({
        openButton: ".button_mini",
        overlay: ".overlay",
        contentBlock: "#order-window",
        closeButton: ".modal__close",
        descriptionBlock: "#order-window .modal__descr",
        productNameBlock: ".catalog-item__subtitle"
    });

    // Валидация форм
    ValidateForms({
        forms: ["#consultation-form", "#consultation-window form", "#order-window form"],
        settings: {
            rules: {
                name: {
                    required: true,
                    minlength: 2
                },
                phone: "required",
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                name: {
                    required: "Пожалуйста, введите своё имя",
                    minlength: jQuery.validator.format("Введите {0} символов!")
                },
                phone: "Пожалуйста, введите свой номер телефона",
                email: {
                    required: "Пожалуйста, введите свою почту",
                    email: "Неправильно введён адрес почты"
                }
            }
        }
    });

    // Маска ввода номера
    InputMask({
        field: `input[name="phone"]`,
        mask: "+7 (999) 999-99-99"
    });

    // Отправка форм
    HandleForms({
        handler: "mailer/smart.php",
        modalWindows: ["#consultation-window", "#order-window"],
        overlay: ".overlay",
        completedWindow: "#completed-window"
    });
}

$(document).ready(fnMain);

function Slider(Options) {
    $(Options.container).slick(Options.settings);
}

function Tabs(Options) {
    $(Options.navBlock).on("click", `li:not(${Options.activeTab})`, function() {
        $(this)
            .addClass(Options.activeTabClass).siblings().removeClass(Options.activeTabClass)
            .closest(Options.container).find(Options.contentBlock).removeClass(Options.activeContentBlockClass)
            .eq($(this).index()).addClass(Options.activeContentBlockClass);
    });
}

function ToggleCards(Options) {
    $(Options.detailsLink).each(function(nCardIndex) {
        $(this).on("click", function(EventObject) {
            EventObject.preventDefault();
            $(Options.summaryBlock).eq(nCardIndex).toggleClass(Options.summaryActiveClass);
            $(Options.detailsBlock).eq(nCardIndex).toggleClass(Options.detailsActiveClass);
        });
    });
    $(Options.summaryLink).each(function(nCardIndex) {
        $(this).on("click", function(EventObject) {
            EventObject.preventDefault();
            $(Options.summaryBlock).eq(nCardIndex).toggleClass(Options.summaryActiveClass);
            $(Options.detailsBlock).eq(nCardIndex).toggleClass(Options.detailsActiveClass);
        });
    });
}

function ModalWindow(Options) {
    $(Options.openButton).on("click", function() {
        $(Options.overlay).fadeIn("slow");
        $(Options.contentBlock).fadeIn("slow");
    });
    $(Options.closeButton).on("click", function() {
        $(Options.contentBlock).fadeOut("slow");
        $(Options.overlay).fadeOut("slow");
    });
}

function OrderWindow(Options) {
    $(Options.openButton).each(function(nCardIndex){
        $(this).on("click", function() {
            $(Options.descriptionBlock).text($(Options.productNameBlock).eq(nCardIndex).text());
        });
        ModalWindow({
            openButton: this,
            overlay: Options.overlay,
            contentBlock: Options.contentBlock,
            closeButton: Options.closeButton
        });
    });
}

function ValidateForms(Options) {
    Options.forms.forEach(sFormSelector => {
        if(Options.settings) {
            const PluginSettings = Options.settings;
            if(PluginSettings.rules) {
                const ValidationRules = PluginSettings.rules;
                for(let sFieldName in ValidationRules) {
                    const Field = $(sFormSelector).find(`[name="${sFieldName}"]`);
                    if(typeof(ValidationRules[sFieldName]) == "string") {
                        Field.removeAttr(ValidationRules[sFieldName]);
                    }
                    if(typeof(ValidationRules[sFieldName]) == "object") {
                        const FieldRules = ValidationRules[sFieldName];
                        if(FieldRules.required) {
                            Field.removeAttr("required");
                        }
                        if(FieldRules.email) {
                            Field.attr("type", "text");
                        }
                        if(FieldRules.minlength) {
                            Field.removeAttr("minlength");
                        }
                    }
                }
            }
            $(sFormSelector).validate(PluginSettings);
        }
        else {
            $(sFormSelector).validate();
        }
    });
}

function InputMask(Options) {
    $(Options.field).mask(Options.mask);
}

function HandleForms(Options) {
    $("form").submit(function(EventObject) {
        EventObject.preventDefault();
        if(!$(this).valid()) {
            return;
        }
        $.ajax({
            type: "POST",
            url: Options.handler,
            data: $(this).serialize()
        }).done(function() {
            $(this).find("input").val("");
            Options.modalWindows.forEach(sBlockSelector => {
                $(sBlockSelector).fadeOut();
                if (!$(Options.overlay).is(":visible")) {
                    $(Options.overlay).fadeIn("slow");
                }
                $(Options.completedWindow).fadeIn("slow");
            });
            $("form").trigger("reset");
        });
        return false;
    });
}