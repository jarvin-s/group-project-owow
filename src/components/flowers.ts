export type { FlowerFrame, Flower } from "./flowers/types";

import { level_1 } from "./flowers/level_1";
import { level_2 } from "./flowers/level_2";
import { level_3 } from "./flowers/level_3";
import { level_4 } from "./flowers/level_4";
import { level_5 } from "./flowers/level_5";
import { level_6 } from "./flowers/level_6";

export { level_1, level_2, level_3, level_4, level_5, level_6 };

export const flowers = {
    level_1: level_1,
    level_2: level_2,
    level_3: level_3,
    level_4: level_4,
    level_5: level_5,
    level_6: level_6,
} as const;
