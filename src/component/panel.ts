import { SizeOptions } from '@/interface/interfaces';

class Panel {
    private min: number = Infinity;
    private max: number = 0;
    private round: (x: number) => number = Math.round;
    private sizeOptions: SizeOptions;
    public dom: HTMLCanvasElement;

    constructor(
        private name: string,
        private fg: string,
        private bg: string
    ) {
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
        context.fillRect(
            this.sizeOptions.graphX,
            this.sizeOptions.graphY,
            this.sizeOptions.graphWidth,
            this.sizeOptions.graphHeight
        );

        context.fillStyle = this.bg;
        context.globalAlpha = 0.9;
        context.fillRect(
            this.sizeOptions.graphX,
            this.sizeOptions.graphY,
            this.sizeOptions.graphWidth,
            this.sizeOptions.graphHeight
        );
    }

    public update(value: number, maxValue: number) {
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
        context.fillText(
            `${this.round(value)} ${this.name} (${this.round(this.min)}-${this.round(this.max)})`,
            this.sizeOptions.textX,
            this.sizeOptions.textY
        );

        context.drawImage(
            this.dom,
            this.sizeOptions.graphX + PR,
            this.sizeOptions.graphY,
            this.sizeOptions.graphWidth - PR,
            this.sizeOptions.graphHeight,
            this.sizeOptions.graphX,
            this.sizeOptions.graphY,
            this.sizeOptions.graphWidth - PR,
            this.sizeOptions.graphHeight
        );

        context.fillRect(
            this.sizeOptions.graphX + this.sizeOptions.graphWidth - PR,
            this.sizeOptions.graphY,
            PR,
            this.sizeOptions.graphHeight
        );

        context.fillStyle = this.bg;
        context.globalAlpha = 0.9;
        context.fillRect(
            this.sizeOptions.graphX + this.sizeOptions.graphWidth - PR,
            this.sizeOptions.graphY,
            PR,
            this.round((1 - value / maxValue) * this.sizeOptions.graphHeight)
        );
    }
}

export { Panel };
