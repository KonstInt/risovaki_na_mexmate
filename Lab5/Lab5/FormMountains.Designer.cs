
namespace Lab5
{
    partial class FormMountains
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.label1 = new System.Windows.Forms.Label();
            this.pictureBox1 = new System.Windows.Forms.PictureBox();
            this.label4 = new System.Windows.Forms.Label();
            this.numericUpDown_step_count = new System.Windows.Forms.NumericUpDown();
            this.label2 = new System.Windows.Forms.Label();
            this.trackBar_cur_step = new System.Windows.Forms.TrackBar();
            this.button_draw = new System.Windows.Forms.Button();
            this.label3 = new System.Windows.Forms.Label();
            this.label5 = new System.Windows.Forms.Label();
            this.trackBar_h1 = new System.Windows.Forms.TrackBar();
            this.trackBar_h2 = new System.Windows.Forms.TrackBar();
            this.label_h1 = new System.Windows.Forms.Label();
            this.label_h2 = new System.Windows.Forms.Label();
            this.label_cur_step = new System.Windows.Forms.Label();
            this.trackBar_r = new System.Windows.Forms.TrackBar();
            this.label_r = new System.Windows.Forms.Label();
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDown_step_count)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.trackBar_cur_step)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.trackBar_h1)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.trackBar_h2)).BeginInit();
            ((System.ComponentModel.ISupportInitialize)(this.trackBar_r)).BeginInit();
            this.SuspendLayout();
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label1.Location = new System.Drawing.Point(607, 9);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(180, 20);
            this.label1.TabIndex = 1;
            this.label1.Text = "Шероховатость (R): ";
            // 
            // pictureBox1
            // 
            this.pictureBox1.BackColor = System.Drawing.Color.White;
            this.pictureBox1.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.pictureBox1.Location = new System.Drawing.Point(12, 12);
            this.pictureBox1.Name = "pictureBox1";
            this.pictureBox1.Size = new System.Drawing.Size(589, 426);
            this.pictureBox1.TabIndex = 2;
            this.pictureBox1.TabStop = false;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label4.Location = new System.Drawing.Point(607, 78);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(124, 20);
            this.label4.TabIndex = 1;
            this.label4.Text = "Число шагов:";
            // 
            // numericUpDown_step_count
            // 
            this.numericUpDown_step_count.Location = new System.Drawing.Point(611, 105);
            this.numericUpDown_step_count.Maximum = new decimal(new int[] {
            10,
            0,
            0,
            0});
            this.numericUpDown_step_count.Name = "numericUpDown_step_count";
            this.numericUpDown_step_count.Size = new System.Drawing.Size(120, 20);
            this.numericUpDown_step_count.TabIndex = 0;
            this.numericUpDown_step_count.Value = new decimal(new int[] {
            5,
            0,
            0,
            0});
            this.numericUpDown_step_count.ValueChanged += new System.EventHandler(this.numericUpDown_step_count_ValueChanged);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label2.Location = new System.Drawing.Point(607, 342);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(46, 20);
            this.label2.TabIndex = 1;
            this.label2.Text = "Шаг:";
            // 
            // trackBar_cur_step
            // 
            this.trackBar_cur_step.Location = new System.Drawing.Point(658, 365);
            this.trackBar_cur_step.Maximum = 5;
            this.trackBar_cur_step.Name = "trackBar_cur_step";
            this.trackBar_cur_step.Size = new System.Drawing.Size(155, 45);
            this.trackBar_cur_step.TabIndex = 3;
            this.trackBar_cur_step.TickStyle = System.Windows.Forms.TickStyle.None;
            this.trackBar_cur_step.Value = 5;
            this.trackBar_cur_step.Scroll += new System.EventHandler(this.trackBar_cur_step_Scroll);
            // 
            // button_draw
            // 
            this.button_draw.Location = new System.Drawing.Point(621, 415);
            this.button_draw.Name = "button_draw";
            this.button_draw.Size = new System.Drawing.Size(167, 23);
            this.button_draw.TabIndex = 4;
            this.button_draw.Text = "Построить";
            this.button_draw.UseVisualStyleBackColor = true;
            this.button_draw.Click += new System.EventHandler(this.button_draw_Click);
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label3.Location = new System.Drawing.Point(607, 128);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(34, 20);
            this.label3.TabIndex = 1;
            this.label3.Text = "h1:";
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label5.Location = new System.Drawing.Point(607, 202);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(34, 20);
            this.label5.TabIndex = 1;
            this.label5.Text = "h2:";
            // 
            // trackBar_h1
            // 
            this.trackBar_h1.Location = new System.Drawing.Point(653, 151);
            this.trackBar_h1.Maximum = 100;
            this.trackBar_h1.Name = "trackBar_h1";
            this.trackBar_h1.Size = new System.Drawing.Size(156, 45);
            this.trackBar_h1.TabIndex = 0;
            this.trackBar_h1.TickFrequency = 5;
            this.trackBar_h1.Value = 50;
            this.trackBar_h1.Scroll += new System.EventHandler(this.trackBar_h1_Scroll);
            // 
            // trackBar_h2
            // 
            this.trackBar_h2.Location = new System.Drawing.Point(653, 222);
            this.trackBar_h2.Maximum = 100;
            this.trackBar_h2.Name = "trackBar_h2";
            this.trackBar_h2.Size = new System.Drawing.Size(156, 45);
            this.trackBar_h2.TabIndex = 5;
            this.trackBar_h2.TickFrequency = 5;
            this.trackBar_h2.Value = 50;
            this.trackBar_h2.Scroll += new System.EventHandler(this.trackBar_h2_Scroll);
            // 
            // label_h1
            // 
            this.label_h1.AutoSize = true;
            this.label_h1.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label_h1.Location = new System.Drawing.Point(607, 151);
            this.label_h1.Name = "label_h1";
            this.label_h1.Size = new System.Drawing.Size(31, 20);
            this.label_h1.TabIndex = 1;
            this.label_h1.Text = "0.5";
            // 
            // label_h2
            // 
            this.label_h2.AutoSize = true;
            this.label_h2.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label_h2.Location = new System.Drawing.Point(607, 222);
            this.label_h2.Name = "label_h2";
            this.label_h2.Size = new System.Drawing.Size(31, 20);
            this.label_h2.TabIndex = 1;
            this.label_h2.Text = "0.5";
            // 
            // label_cur_step
            // 
            this.label_cur_step.AutoSize = true;
            this.label_cur_step.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label_cur_step.Location = new System.Drawing.Point(607, 365);
            this.label_cur_step.Name = "label_cur_step";
            this.label_cur_step.Size = new System.Drawing.Size(27, 20);
            this.label_cur_step.TabIndex = 1;
            this.label_cur_step.Text = "50";
            // 
            // trackBar_r
            // 
            this.trackBar_r.Location = new System.Drawing.Point(653, 30);
            this.trackBar_r.Maximum = 400;
            this.trackBar_r.Name = "trackBar_r";
            this.trackBar_r.Size = new System.Drawing.Size(156, 45);
            this.trackBar_r.TabIndex = 0;
            this.trackBar_r.TickFrequency = 5;
            this.trackBar_r.TickStyle = System.Windows.Forms.TickStyle.None;
            this.trackBar_r.Value = 30;
            this.trackBar_r.Scroll += new System.EventHandler(this.trackBar_r_Scroll);
            // 
            // label_r
            // 
            this.label_r.AutoSize = true;
            this.label_r.Font = new System.Drawing.Font("Microsoft Sans Serif", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(204)));
            this.label_r.Location = new System.Drawing.Point(610, 30);
            this.label_r.Name = "label_r";
            this.label_r.Size = new System.Drawing.Size(31, 20);
            this.label_r.TabIndex = 1;
            this.label_r.Text = "0.5";
            // 
            // Task2
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(832, 450);
            this.Controls.Add(this.trackBar_h2);
            this.Controls.Add(this.trackBar_r);
            this.Controls.Add(this.trackBar_h1);
            this.Controls.Add(this.button_draw);
            this.Controls.Add(this.trackBar_cur_step);
            this.Controls.Add(this.pictureBox1);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label_cur_step);
            this.Controls.Add(this.label_h2);
            this.Controls.Add(this.label_r);
            this.Controls.Add(this.label_h1);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.numericUpDown_step_count);
            this.Name = "Task2";
            this.Text = "Task2";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Task2_FormClosing);
            ((System.ComponentModel.ISupportInitialize)(this.pictureBox1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.numericUpDown_step_count)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.trackBar_cur_step)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.trackBar_h1)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.trackBar_h2)).EndInit();
            ((System.ComponentModel.ISupportInitialize)(this.trackBar_r)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.PictureBox pictureBox1;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.NumericUpDown numericUpDown_step_count;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TrackBar trackBar_cur_step;
        private System.Windows.Forms.Button button_draw;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label5;
        private System.Windows.Forms.TrackBar trackBar_h1;
        private System.Windows.Forms.TrackBar trackBar_h2;
        private System.Windows.Forms.Label label_h1;
        private System.Windows.Forms.Label label_h2;
        private System.Windows.Forms.Label label_cur_step;
        private System.Windows.Forms.TrackBar trackBar_r;
        private System.Windows.Forms.Label label_r;
    } 
}