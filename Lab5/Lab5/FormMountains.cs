using System;
using System.Collections.Generic;
using System.Drawing;
using System.Reflection.Emit;
using System.Windows.Forms;

namespace Lab5
{
    partial class FormMountains : Form
    {
        public float h1, h2, R;
        public int step_count, cur_step;
        private Graphics _graphics;
        private Bitmap _bitmap;
        public Random random = new Random();

        public List<List<PointF>> steps = new List<List<PointF>>();
        public FormMountains()
        {
            InitializeComponent();

            _bitmap = new Bitmap(pictureBox1.Width, pictureBox1.Height);
            _graphics = Graphics.FromImage(_bitmap);
            _graphics.Clear(Color.White);
            pictureBox1.Image = _bitmap;


            h1 = (float)trackBar_h1.Value / 100;
            h2 = (float)trackBar_h2.Value / 100;
            R = (float)trackBar_r.Value / 100;
            label_r.Text = R.ToString();
            step_count = (int)numericUpDown_step_count.Value;
            cur_step = step_count;

            label_cur_step.Text = cur_step.ToString();

        }

        public float GetRandomFloat(float minValue, float maxValue)
        {
            return (float)(random.NextDouble() * (maxValue - minValue) + minValue);
        }

        public void GenerateMountains()
        {
            trackBar_cur_step.Maximum = step_count;
            trackBar_cur_step.Value = step_count;
            cur_step = step_count;
            label_cur_step.Text = cur_step.ToString();

            float hL = h1 * pictureBox1.Height;
            float hR = h2 * pictureBox1.Height;

            steps.Clear();

            steps.Add(new List<PointF> { new PointF(0, hL), new PointF(pictureBox1.Width, hR) });

            for (int i = 0; i < step_count; ++i)
            {
                steps.Add(new List<PointF>());
                steps[i + 1].Add(steps[i][0]);
                for (int j = 1; j < steps[i].Count; ++j)
                {
                    var p1 = steps[i][j];
                    var p2 = steps[i][j - 1];

                    var L = Length(p1, p2);

                    steps[i + 1].Add(new PointF(Middle(p1, p2), (p1.Y + p2.Y) / 2 + GetRandomFloat(-R * L, R * L)));
                    steps[i + 1].Add(steps[i][j]);
                }
            }
        }

        public void DrawMountains()
        {
            if (steps.Count == 0) return;

            _graphics.Clear(Color.White);
            Pen brush = new Pen(Color.Black);

            _graphics.DrawEllipse(brush, steps[cur_step][0].X - 2, steps[cur_step][0].Y - 2, 4, 4);
            for (int i = 1; i < steps[cur_step].Count; ++i)
            {
                _graphics.DrawEllipse(brush, steps[cur_step][i].X - 2, steps[cur_step][i].Y - 2, 4, 4);
                _graphics.DrawLine(brush, steps[cur_step][i - 1].X, steps[cur_step][i - 1].Y, steps[cur_step][i].X, steps[cur_step][i].Y);
            }
            pictureBox1.Invalidate();
        }

        public float Length(PointF p1, PointF p2)
        {
            float deltaX = p2.X - p1.X;
            float deltaY = p2.Y - p1.Y;
            return (float)Math.Sqrt(deltaX * deltaX + deltaY * deltaY);
        }
        public float Middle(PointF p1, PointF p2)
        {
            return (p1.X + p2.X) / 2;
        }

        private void Task2_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (e.CloseReason == CloseReason.UserClosing)
            {
                e.Cancel = true;
                Hide();

            }
        }

        private void trackBar_cur_step_Scroll(object sender, EventArgs e)
        {
            cur_step = trackBar_cur_step.Value;
            label_cur_step.Text = cur_step.ToString();
            DrawMountains();
        }

        private void trackBar_r_Scroll(object sender, EventArgs e)
        {
            R = (float)trackBar_r.Value / 100;
            label_r.Text = R.ToString();
        }

        private void numericUpDown_step_count_ValueChanged(object sender, EventArgs e)
        {
            step_count = (int)numericUpDown_step_count.Value;
        }

        private void button_draw_Click(object sender, EventArgs e)
        {
            GenerateMountains();
            DrawMountains();
        }

        private void trackBar_h2_Scroll(object sender, EventArgs e)
        {
            h2 = (float)trackBar_h2.Value / 100;
            label_h2.Text = h2.ToString();
        }

        private void trackBar_h1_Scroll(object sender, EventArgs e)
        {
            h1 = (float)trackBar_h1.Value / 100;
            label_h1.Text = h1.ToString();
        }
    }
}
