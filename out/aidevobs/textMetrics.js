"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTextObservability = calculateTextObservability;
function calculateTextObservability(text) {
    const totalchars = text.length;
    return {
        totalchars,
        estimatedTokens: Math.ceil(totalchars / 4),
        tokenCountingMethod: 'totalchars/4'
    };
}
//# sourceMappingURL=textMetrics.js.map