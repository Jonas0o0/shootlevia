import View from "./View.ts";

class HomeView extends View{
    background: Element;
    banner: Element;

    constructor(element: Element, background: Element, banner: Element) {
        super(element);
        this.background = background;
        this.banner = banner;
    }

    show(){
     super.show();
        this.background.classList.add('minimize');
        this.banner.classList.add('maximize');
    }

    hide(){
     super.hide();
        this.background.classList.remove('minimize');
        this.banner.classList.remove('maximize');
    }
}

export default HomeView;