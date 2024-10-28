class Panel {
    name;
    fg;
    bg;
    min = Infinity;
    max = 0;
    round = Math.round;
    sizeOptions;
    dom;
    constructor(name, fg, bg) {
        this.name = name;
        this.fg = fg;
        this.bg = bg;
        const PR = this.round(window.devicePixelRatio || 1);
        this.sizeOptions = {
            pr: PR,
            width: 80 * PR,
            height: 48 * PR,
            textX: 3 * PR,
            textY: 2 * PR,
            graphX: 3 * PR,
            graphY: 15 * PR,
            graphWidth: 74 * PR,
            graphHeight: 30 * PR
        };
        this.dom = document.createElement('canvas');
        this.dom.width = this.sizeOptions.width;
        this.dom.height = this.sizeOptions.height;
        this.dom.style.cssText = 'width:80px;height:48px';
        const context = this.dom.getContext('2d');
        if (!context) {
            throw new Error('Unable to get 2d context');
        }
        context.font = `bold ${9 * PR}px Helvetica,Arial,sans-serif`;
        context.textBaseline = 'top';
        context.fillStyle = this.bg;
        context.fillRect(0, 0, this.sizeOptions.width, this.sizeOptions.height);
        context.fillStyle = this.fg;
        context.fillText(this.name, this.sizeOptions.textX, this.sizeOptions.textY);
        context.fillRect(this.sizeOptions.graphX, this.sizeOptions.graphY, this.sizeOptions.graphWidth, this.sizeOptions.graphHeight);
        context.fillStyle = this.bg;
        context.globalAlpha = 0.9;
        context.fillRect(this.sizeOptions.graphX, this.sizeOptions.graphY, this.sizeOptions.graphWidth, this.sizeOptions.graphHeight);
    }
    update(value, maxValue) {
        this.min = Math.min(this.min, value);
        this.max = Math.max(this.max, value);
        const PR = this.sizeOptions.pr;
        const context = this.dom.getContext('2d');
        if (!context) {
            throw new Error('Unable to get 2d context');
        }
        // Reset
        context.fillStyle = this.bg;
        context.globalAlpha = 1;
        context.fillRect(0, 0, this.sizeOptions.width, this.sizeOptions.graphY);
        context.fillStyle = this.fg;
        context.fillText(`${this.round(value)} ${this.name} (${this.round(this.min)}-${this.round(this.max)})`, this.sizeOptions.textX, this.sizeOptions.textY);
        context.drawImage(this.dom, this.sizeOptions.graphX + PR, this.sizeOptions.graphY, this.sizeOptions.graphWidth - PR, this.sizeOptions.graphHeight, this.sizeOptions.graphX, this.sizeOptions.graphY, this.sizeOptions.graphWidth - PR, this.sizeOptions.graphHeight);
        context.fillRect(this.sizeOptions.graphX + this.sizeOptions.graphWidth - PR, this.sizeOptions.graphY, PR, this.sizeOptions.graphHeight);
        context.fillStyle = this.bg;
        context.globalAlpha = 0.9;
        context.fillRect(this.sizeOptions.graphX + this.sizeOptions.graphWidth - PR, this.sizeOptions.graphY, PR, this.round((1 - value / maxValue) * this.sizeOptions.graphHeight));
    }
}

class Stats {
    static version = '1.0.0';
    performanceInfo = self.performance;
    mode = 0;
    container;
    beginTime = (this.performanceInfo || Date).now();
    prevTime = this.beginTime;
    frames = 0;
    fpsPanel;
    msPanel;
    memPanel;
    constructor() {
        this.container = document.createElement('div');
        this.container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:90000';
        this.container.addEventListener('click', (event) => {
            event.preventDefault();
            this.showPanel(++this.mode % this.container.children.length);
        }, false);
        this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
        this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));
        if ('memory' in this.performanceInfo) {
            this.memPanel = this.addPanel(new Panel('MB', '#f08', '#201'));
        }
        this.showPanel(0);
    }
    begin() {
        this.beginTime = (this.performanceInfo || Date).now();
    }
    end() {
        this.frames++;
        const time = (this.performanceInfo || Date).now();
        this.msPanel.update(time - this.beginTime, 200);
        if (time >= this.prevTime + 1000) {
            this.fpsPanel.update((this.frames * 1000) / (time - this.prevTime), 100);
            this.prevTime = time;
            this.frames = 0;
            if (this.memPanel) {
                const memory = this.performanceInfo.memory;
                this.memPanel.update(memory.usedJSHeapSize / 1048576, memory.jsHeapSizeLimit / 1048576);
            }
        }
        return time;
    }
    update() {
        this.beginTime = this.end();
    }
    get version() {
        return Stats.version;
    }
    get dom() {
        return this.container;
    }
    setMode(id) {
        this.showPanel(id);
    }
    addPanel(panel) {
        this.container.appendChild(panel.dom);
        return panel;
    }
    showPanel(id) {
        for (let i = 0; i < this.container.children.length; i++) {
            this.container.children[i].style.display = i === id ? 'block' : 'none';
        }
        this.mode = id;
    }
}

export { Stats };
