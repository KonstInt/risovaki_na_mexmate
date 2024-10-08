namespace Lab3Rastr
{
    partial class Menu
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
            button2 = new Button();
            button1 = new Button();
            SuspendLayout();
            // 
            // button2
            // 
            button2.Location = new Point(86, 117);
            button2.Name = "button2";
            button2.Size = new Size(107, 62);
            button2.TabIndex = 1;
            button2.Text = "Рисование отрезка";
            button2.UseVisualStyleBackColor = true;
            button2.Click += button2_Click;
            // 
            // button1
            // 
            button1.Location = new Point(86, 198);
            button1.Name = "button1";
            button1.Size = new Size(107, 58);
            button1.TabIndex = 2;
            button1.Text = "Рисование градиентного треугольника";
            button1.UseVisualStyleBackColor = true;
            button1.Click += button1_Click;
            // 
            // Menu
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(276, 318);
            Controls.Add(button1);
            Controls.Add(button2);
            Name = "Menu";
            ShowIcon = false;
            StartPosition = FormStartPosition.CenterScreen;
            Text = "Выбор задания";
            ResumeLayout(false);
        }

        #endregion
        private Button button2;
        private Button button1;
    }
}