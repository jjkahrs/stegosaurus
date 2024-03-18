export interface ImageSelectorProps {
    callback( path: string, context: CanvasRenderingContext2D ): void;
    onClear(): void;
}