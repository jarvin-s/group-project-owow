import { flowers, Flower } from "@/components/flowers";

export const BOARD_W = 84;
export const BOARD_H = 28;
export const USER_POSITIONS = [11, 32, 53, 74];

export interface UserFlower {
    user_id?: string;
    first_name?: string;
    name?: string;
    goal_completions?: number;
    daily_calories?: number;
    daily_calories_goal?: number;
    flower?: Flower;
    // For leaderboard data
    id?: number;
    level?: number;
    kcal_current?: number;
    kcal_goal?: number;
    flower_data?: number[][];
}

export interface UserData {
    id: number;
    name: string;
    level?: number;
    kcal_current?: number;
    kcal_goal?: number;
    flower_data?: number[][];
    data?: {
        first_name?: string;
    };
}

export function getFlowerShape(user: UserData | UserFlower): number[][] | null {
    if ('flower_data' in user && user.flower_data && Array.isArray(user.flower_data)) {
        return user.flower_data;
    }

    if ('flower' in user && user.flower) {
        if (Array.isArray(user.flower) && user.flower.length > 0) {
            const lastFrame = user.flower[user.flower.length - 1];
            if (Array.isArray(lastFrame)) {
                return lastFrame;
            }
        }
    }

    const lvl = 'goal_completions' in user ? (user.goal_completions ?? user.level ?? 1) : (user.level ?? 1);
    if (lvl && lvl <= 6) {
        const levelKey = `level_${lvl}` as keyof typeof flowers;
        const staticFrames = flowers[levelKey];
        if (staticFrames && staticFrames.length > 0) {
            return staticFrames[staticFrames.length - 1];
        }
    }

    return null;
}

export function drawPot(grid: number[][], cx: number, groundY: number): void {
    for (let x = cx - 3; x <= cx + 3; x++)
        if (grid[groundY]) grid[groundY][x] = 1;
    for (let x = cx - 4; x <= cx + 4; x++)
        if (grid[groundY - 1]) grid[groundY - 1][x] = 1;
    for (let x = cx - 5; x <= cx + 5; x++)
        if (grid[groundY - 2]) grid[groundY - 2][x] = 1;
    for (let x = cx - 4; x <= cx + 4; x++)
        if (grid[groundY - 3]) grid[groundY - 3][x] = 1;
    if (grid[groundY - 2]) {
        grid[groundY - 2][cx - 6] = 1;
        grid[groundY - 2][cx + 6] = 1;
    }
}

export function calculateStemHeight(user: UserData | UserFlower): number {
    let progress = 0;
    let current = 0;
    let goal = 0;

    if ('kcal_current' in user || 'kcal_goal' in user) {
        current = user.kcal_current || 0;
        goal = user.kcal_goal || 0;
    } else if ('daily_calories' in user) {
        current = user.daily_calories || 0;
        goal = user.daily_calories_goal || 0;
    }

    if (goal > 0) {
        progress = Math.min(Math.max(current / goal, 0), 1);
    }
    const maxStemH = 8;
    return Math.floor(progress * maxStemH);
}

export function drawStem(
    grid: number[][],
    cx: number,
    groundY: number,
    stemH: number
): void {
    for (let i = 0; i < stemH; i++) {
        if (grid[groundY - 4 - i]) grid[groundY - 4 - i][cx] = 1;
    }
}

export function drawFlower(
    grid: number[][],
    flowerGrid: number[][],
    cx: number,
    groundY: number,
    stemH: number
): void {
    const rows = flowerGrid.length;
    const cols = flowerGrid[0].length;
    const visualStemH = Math.max(stemH, 2);
    const topY = groundY - 4 - visualStemH - Math.floor(rows / 2);
    const leftX = cx - Math.floor(cols / 2);

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (flowerGrid[r] && flowerGrid[r][c] === 1) {
                const y = topY + r;
                const x = leftX + c;
                if (grid[y] && grid[y][x] !== undefined) grid[y][x] = 1;
            }
        }
    }
}

export function buildGrid(users: (UserData | UserFlower)[]): number[][] {
    const grid = Array.from({ length: BOARD_H }, () => Array(BOARD_W).fill(0));
    const groundY = BOARD_H - 4;

    users.forEach((user, index) => {
        const cx = USER_POSITIONS[index];
        if (!cx) return;

        drawPot(grid, cx, groundY);

        const stemH = calculateStemHeight(user);
        drawStem(grid, cx, groundY, stemH);

        const flowerGrid = getFlowerShape(user);
        if (flowerGrid) {
            drawFlower(grid, flowerGrid, cx, groundY, stemH);
        }
    });

    return grid;
}

export function extractFirstName(user: UserData | UserFlower): string | null {
    if ('first_name' in user && user.first_name) {
        return user.first_name;
    }
    if ('name' in user && user.name) {
        return user.name;
    }
    if ('data' in user && user.data?.first_name) {
        return user.data.first_name;
    }
    return null;
}

export function generateFlowerFromLevel(level: number): Flower {
    if (level <= 6) {
        const levelKey = `level_${level}` as keyof typeof flowers;
        const staticFrames = flowers[levelKey];
        if (staticFrames && staticFrames.length > 0) {
            return staticFrames;
        }
    }
    return [];
}

