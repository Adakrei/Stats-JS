declare class Stats {
    private static version;
    private performanceInfo;
    private mode;
    private container;
    private beginTime;
    private prevTime;
    private frames;
    private fpsPanel;
    private msPanel;
    private memPanel?;
    constructor();
    begin(): void;
    end(): number;
    update(): void;
    get version(): string;
    get dom(): HTMLDivElement;
    setMode(id: number): void;
    private addPanel;
    private showPanel;
}

export { Stats };
