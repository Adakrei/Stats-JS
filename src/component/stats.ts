import { Panel } from './panel';
import { PerformanceInfo } from '@/interface/interfaces';

class Stats {
    private static version: string = '__version__';
    private performanceInfo = self.performance as PerformanceInfo;
    private mode = 0;
    private container: HTMLDivElement;
    private beginTime: number = (this.performanceInfo || Date).now();
    private prevTime: number = this.beginTime;
    private frames = 0;
    private fpsPanel: Panel;
    private msPanel: Panel;
    private memPanel?: Panel;

    constructor() {
        this.container = document.createElement('div');
        this.container.style.cssText = 'position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:90000';
        this.container.addEventListener(
            'click',
            (event: MouseEvent) => {
                event.preventDefault();
                this.showPanel(++this.mode % this.container.children.length);
            },
            false
        );

        this.fpsPanel = this.addPanel(new Panel('FPS', '#0ff', '#002'));
        this.msPanel = this.addPanel(new Panel('MS', '#0f0', '#020'));

        if ('memory' in this.performanceInfo) {
            this.memPanel = this.addPanel(new Panel('MB', '#f08', '#201'));
        }

        this.showPanel(0);
    }

    public begin() {
        this.beginTime = (this.performanceInfo || Date).now();
    }

    public end() {
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

    public update() {
        this.beginTime = this.end();
    }

    public get version(): string {
        return Stats.version;
    }

    public get dom(): HTMLDivElement {
        return this.container;
    }

    public setMode(id: number) {
        this.showPanel(id);
    }

    private addPanel(panel: Panel): Panel {
        this.container.appendChild(panel.dom);

        return panel;
    }

    private showPanel(id: number) {
        for (let i = 0; i < this.container.children.length; i++) {
            (this.container.children[i] as HTMLElement).style.display = i === id ? 'block' : 'none';
        }
        this.mode = id;
    }
}

export { Stats };
