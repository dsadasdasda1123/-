import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.util.LinkedList;
import java.util.Random;

public class SnakeGame extends JPanel implements ActionListener {
    private static final int CELL_SIZE = 20;
    private static final int COLS = 30;
    private static final int ROWS = 20;
    private static final int WIDTH = COLS * CELL_SIZE;
    private static final int HEIGHT = ROWS * CELL_SIZE;
    private static final int TIMER_DELAY = 120;

    private enum Direction {UP, DOWN, LEFT, RIGHT}

    private final LinkedList<Point> snake = new LinkedList<>();
    private final Random random = new Random();
    private final Timer timer;

    private Direction direction = Direction.RIGHT;
    private Point food;
    private boolean running = true;
    private int score = 0;

    public SnakeGame() {
        setPreferredSize(new Dimension(WIDTH, HEIGHT));
        setBackground(Color.BLACK);
        setFocusable(true);

        initGame();

        addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                switch (e.getKeyCode()) {
                    case KeyEvent.VK_UP:
                    case KeyEvent.VK_W:
                        if (direction != Direction.DOWN) direction = Direction.UP;
                        break;
                    case KeyEvent.VK_DOWN:
                    case KeyEvent.VK_S:
                        if (direction != Direction.UP) direction = Direction.DOWN;
                        break;
                    case KeyEvent.VK_LEFT:
                    case KeyEvent.VK_A:
                        if (direction != Direction.RIGHT) direction = Direction.LEFT;
                        break;
                    case KeyEvent.VK_RIGHT:
                    case KeyEvent.VK_D:
                        if (direction != Direction.LEFT) direction = Direction.RIGHT;
                        break;
                    case KeyEvent.VK_R:
                        if (!running) {
                            initGame();
                            timer.start();
                        }
                        break;
                    default:
                        break;
                }
            }
        });

        timer = new Timer(TIMER_DELAY, this);
        timer.start();
    }

    private void initGame() {
        snake.clear();
        snake.add(new Point(COLS / 2, ROWS / 2));
        snake.add(new Point(COLS / 2 - 1, ROWS / 2));
        snake.add(new Point(COLS / 2 - 2, ROWS / 2));
        direction = Direction.RIGHT;
        score = 0;
        running = true;
        spawnFood();
        repaint();
    }

    private void spawnFood() {
        while (true) {
            Point p = new Point(random.nextInt(COLS), random.nextInt(ROWS));
            if (!snake.contains(p)) {
                food = p;
                return;
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (!running) {
            return;
        }

        Point head = snake.getFirst();
        Point newHead = switch (direction) {
            case UP -> new Point(head.x, head.y - 1);
            case DOWN -> new Point(head.x, head.y + 1);
            case LEFT -> new Point(head.x - 1, head.y);
            case RIGHT -> new Point(head.x + 1, head.y);
        };

        // 碰墙
        if (newHead.x < 0 || newHead.x >= COLS || newHead.y < 0 || newHead.y >= ROWS) {
            gameOver();
            return;
        }

        // 碰自己（允许移动到当前尾巴的位置）
        Point tail = snake.getLast();
        boolean hitsBody = snake.contains(newHead) && !newHead.equals(tail);
        if (hitsBody) {
            gameOver();
            return;
        }

        snake.addFirst(newHead);

        if (newHead.equals(food)) {
            score++;
            spawnFood();
        } else {
            snake.removeLast();
        }

        repaint();
    }

    private void gameOver() {
        running = false;
        timer.stop();
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        // 网格（淡色）
        g.setColor(new Color(40, 40, 40));
        for (int x = 0; x <= WIDTH; x += CELL_SIZE) {
            g.drawLine(x, 0, x, HEIGHT);
        }
        for (int y = 0; y <= HEIGHT; y += CELL_SIZE) {
            g.drawLine(0, y, WIDTH, y);
        }

        // 食物
        g.setColor(Color.RED);
        g.fillOval(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

        // 蛇
        for (int i = 0; i < snake.size(); i++) {
            Point p = snake.get(i);
            if (i == 0) {
                g.setColor(new Color(0, 220, 0));
            } else {
                g.setColor(new Color(0, 170, 0));
            }
            g.fillRoundRect(p.x * CELL_SIZE + 1, p.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2, 8, 8);
        }

        // 分数
        g.setColor(Color.WHITE);
        g.setFont(new Font("SansSerif", Font.BOLD, 18));
        g.drawString("Score: " + score, 10, 22);

        if (!running) {
            g.setColor(new Color(0, 0, 0, 180));
            g.fillRect(0, 0, WIDTH, HEIGHT);

            g.setColor(Color.WHITE);
            g.setFont(new Font("SansSerif", Font.BOLD, 36));
            String over = "Game Over";
            int overW = g.getFontMetrics().stringWidth(over);
            g.drawString(over, (WIDTH - overW) / 2, HEIGHT / 2 - 10);

            g.setFont(new Font("SansSerif", Font.PLAIN, 18));
            String tip = "Press R to restart";
            int tipW = g.getFontMetrics().stringWidth(tip);
            g.drawString(tip, (WIDTH - tipW) / 2, HEIGHT / 2 + 28);
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            JFrame frame = new JFrame("Snake Game (Java)");
            SnakeGame game = new SnakeGame();
            frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
            frame.setResizable(false);
            frame.add(game);
            frame.pack();
            frame.setLocationRelativeTo(null);
            frame.setVisible(true);
            game.requestFocusInWindow();
        });
    }
}
