-- 배치 격자를 4칸 기준에서 12칸 기준으로 확장한다(2/3/4/6등분이 전부 나누어떨어지도록).
-- 기존에 저장된 좌표(grid_x, grid_width)는 4칸 기준이므로, 배율(12/4=3)을 곱해 그대로 같은 비율로 환산한다.
-- 세로 칸 수(grid_y, grid_height)는 이번에 바뀌지 않으므로 그대로 둔다.
UPDATE section_layout
SET grid_x = grid_x * 3,
    grid_width = grid_width * 3;
