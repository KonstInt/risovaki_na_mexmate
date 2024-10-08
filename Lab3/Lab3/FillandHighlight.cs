using System;
using System.Collections.Generic;
using System.Drawing;
using System.Windows.Forms;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Button;

namespace Lab3Rastr
{
    public partial class FillandHighlight : Form
    {
        public FillandHighlight()
        {
            InitializeComponent();
            g.Clear(Color.White);
        }

        // Правильное закрытие окна
        private void FillandHighlight_FormClosed(object sender, FormClosedEventArgs e)
        {
            Form ifrm = Application.OpenForms[0];
            ifrm.Show();
        }

        // Выбор цвета
        private void button1_Click(object sender, EventArgs e)
        {
            colorDialog1.ShowDialog();
        }

        static Bitmap bmp = new Bitmap(485, 491); // Основное изображение

        bool mouse_Down = false;
        bool is_fill = false;
        public Graphics g = Graphics.FromImage(bmp);
        Pen myPen = new Pen(Color.Black, 3f); // Карандаш для рисования
        public string img;  // Имя файла изображения для заливки
        public Bitmap bmp_pic; // Изображение для заливки
        public Bitmap picBmp; // Буфер изображения
        public static Color backColor; // Цвет фона

        // Координаты для рисования
        Point[] points = new Point[2];

        // Обработка нажатия мыши для начала рисования или заливки
        private void pictureBox1_MouseDown(object sender, MouseEventArgs e)
        {
            mouse_Down = true;
            is_fill = true;
            points[0] = new Point(e.X, e.Y);
            myPen.StartCap = System.Drawing.Drawing2D.LineCap.Round;
            myPen.EndCap = System.Drawing.Drawing2D.LineCap.Round;
            myPen.Color = colorDialog1.Color;
        }

        private void pictureBox1_MouseUp(object sender, MouseEventArgs e)
        {
            mouse_Down = false;

            if (radioButton1.Checked) // Если выбрана заливка цветом
            {
                if (is_fill)
                {
                    FloodFill(e.X, e.Y);
                    pictureBox1.Image = bmp;
                }
            }
            else if (radioButton3.Checked) // Если выбрана заливка изображением
            {
                if (is_fill)
                {
                    FloodFillWithImage(e.X, e.Y);
                    pictureBox1.Image = bmp;
                }
            }
            else if (radioButton3.Checked) // Если выбрано выделение границы
            {
                if (is_fill)
                    Connected(e.X, e.Y);
            }
        }

        // Рисование линии при движении мыши
        private void pictureBox1_MouseMove(object sender, MouseEventArgs e)
        {
            is_fill = false;
            if (mouse_Down)
            {
                points[1] = new Point(e.X, e.Y);
                g.DrawLines(myPen, points);
                pictureBox1.Image = bmp;
                points[0] = points[1];
                points[1] = new Point(e.X, e.Y);
            }
        }

        // Рекурсивная заливка цветом
        public void FloodFill(int x, int y)
        {
            Color targetColor = bmp.GetPixel(x, y); // Исходный цвет
            Color fillColor = colorDialog1.Color; // Цвет заливки

            if (targetColor == fillColor) return; // Прекращаем, если цвета совпадают

            FloodFillRec(x, y, targetColor, fillColor);
        }

        // Рекурсивная функция заливки
        private void FloodFillRec(int x, int y, Color targetColor, Color fillColor)
        {
            if (x < 0 || x >= bmp.Width || y < 0 || y >= bmp.Height) return;
            if (bmp.GetPixel(x, y) != targetColor) return;

            bmp.SetPixel(x, y, fillColor);

            FloodFillRec(x + 1, y, targetColor, fillColor);
            FloodFillRec(x - 1, y, targetColor, fillColor);
            FloodFillRec(x, y + 1, targetColor, fillColor);
            FloodFillRec(x, y - 1, targetColor, fillColor);
        }

        // Рекурсивная заливка изображением (паттерном)
        public void FloodFillWithImage(int x, int y)
        {
            if (bmp_pic == null) return; // Если нет изображения для заливки

            Color targetColor = bmp.GetPixel(x, y);
            FloodFillImageRec(x, y, targetColor);
        }

        private void FloodFillImageRec(int x, int y, Color targetColor)
        {
            if (x < 0 || x >= bmp.Width || y < 0 || y >= bmp.Height) return;
            if (bmp.GetPixel(x, y) != targetColor) return;

            int imgX = x % bmp_pic.Width;
            int imgY = y % bmp_pic.Height;
            bmp.SetPixel(x, y, bmp_pic.GetPixel(imgX, imgY));

            FloodFillImageRec(x + 1, y, targetColor);
            FloodFillImageRec(x - 1, y, targetColor);
            FloodFillImageRec(x, y + 1, targetColor);
            FloodFillImageRec(x, y - 1, targetColor);
        }

        // Загрузка изображения
        private void button4_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Filter = "Image Files|*.jpeg;*.jpg;*.png";
                if (ofd.ShowDialog() == DialogResult.OK)
                {
                    this.img = ofd.FileName;
                    bmp_pic = new Bitmap(this.img);
                }
                pictureBox1.Image = bmp_pic;
            }
        }

        // Очистка изображения
        private void button2_Click(object sender, EventArgs e)
        {
            g.Clear(Color.White);
            pictureBox1.Image = bmp;
        }

        // Алгоритм выделения границы области
        void Connected(int x, int y)
        {
            List<Point> boundary = new List<Point>();
            Color targetColor = bmp_pic.GetPixel(x, y);
            TraceBoundary(x, y, targetColor, boundary);
            DrawBoundary(boundary);
        }

        // Обход границы
        private void TraceBoundary(int x, int y, Color targetColor, List<Point> boundary)
        {
            if (x < 0 || x >= bmp_pic.Width || y < 0 || y >= bmp_pic.Height) return;
            if (bmp_pic.GetPixel(x, y) != targetColor) return;

            Stack<Point> stack = new Stack<Point>();
            stack.Push(new Point(x, y));

            while (stack.Count > 0)
            {
                Point p = stack.Pop();
                int px = p.X;
                int py = p.Y;

                if (bmp_pic.GetPixel(px, py) == targetColor)
                {
                    boundary.Add(p);
                    bmp_pic.SetPixel(px, py, Color.Black); // Прорисовка границы

                    if (px + 1 < bmp_pic.Width) stack.Push(new Point(px + 1, py));
                    if (px - 1 >= 0) stack.Push(new Point(px - 1, py));
                    if (py + 1 < bmp_pic.Height) stack.Push(new Point(px, py + 1));
                    if (py - 1 >= 0) stack.Push(new Point(px, py - 1));
                }
            }
        }

        // Отрисовка границы
        private void DrawBoundary(List<Point> boundary)
        {
            foreach (Point p in boundary)
            {
                bmp.SetPixel(p.X, p.Y, Color.Blue); // Рисуем синий цвет для границы
            }
            pictureBox1.Image = bmp;
        }

       
    }
}
