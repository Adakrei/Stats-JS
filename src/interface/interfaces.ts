interface MemoryInfo {
    jsHeapSizeLimit: number;
    totalJSHeapSize: number;
    usedJSHeapSize: number;
}

export interface PerformanceInfo extends Performance {
    memory: MemoryInfo;
}

export interface SizeOptions {
    pr: number;
    width: number;
    height: number;
    textX: number;
    textY: number;
    graphX: number;
    graphY: number;
    graphWidth: number;
    graphHeight: number;
}
