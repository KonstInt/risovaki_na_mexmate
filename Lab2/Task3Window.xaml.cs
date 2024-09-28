using Microsoft.Win32;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Lab2
{
    /// <summary>
    /// Логика взаимодействия для Task3Window.xaml
    /// </summary>
    public partial class Task3Window : Window
    {
        private BitmapSource originalImage; // Оригинальное изображение в RGB
        private WriteableBitmap hsvImage; // Изображение для работы с HSV
        public Task3Window()
        {
            InitializeComponent();
        }

        private void OnLoadImage(object sender, RoutedEventArgs e)
        {
            OpenFileDialog openFileDialog = new OpenFileDialog();
            openFileDialog.Filter = "Image Files|*.jpg;*.jpeg;*.png;";
            if (openFileDialog.ShowDialog() == true)
            {
                originalImage = new BitmapImage(new Uri(openFileDialog.FileName));
                hsvImage = new WriteableBitmap(originalImage);
                ImageDisplay.Source = hsvImage; // Отобразить изображение
                UpdateHSVImage(); // Обновляем изображение с параметрами по умолчанию
            }
        }

        // Обработчик изменения значений слайдеров
        private void OnHSVSliderChanged(object sender, RoutedPropertyChangedEventArgs<double> e)
        {
            UpdateHSVImage();
        }

        // Обновление изображения при изменении HSV
        private void UpdateHSVImage()
        {
            if (originalImage == null) return;

            double hue = HueSlider.Value;
            double saturation = SaturationSlider.Value;
            double value = ValueSlider.Value;

            int width = originalImage.PixelWidth;
            int height = originalImage.PixelHeight;
            int stride = (width * originalImage.Format.BitsPerPixel + 7) / 8;
            byte[] pixelData = new byte[height * stride];
            originalImage.CopyPixels(pixelData, stride, 0);

            // Применение HSV
            for (int i = 0; i < pixelData.Length; i += 4)
            {
                byte r = pixelData[i];
                byte g = pixelData[i + 1];
                byte b = pixelData[i + 2];

                // Преобразуем RGB в HSV
                RGBtoHSV(r, g, b, out double h, out double s, out double v);

                // Заменим значения H, S, V
                h = (h + hue) % 360; // Устанавливаем новое значение оттенка
                s = Math.Min(1, s * saturation); // Насыщенность
                v = Math.Min(1, v * value); // Яркость

                // Преобразуем обратно в RGB
                HSVtoRGB(h, s, v, out byte newR, out byte newG, out byte newB);

                // Обновляем пиксели
                pixelData[i] = newR;
                pixelData[i + 1] = newG;
                pixelData[i + 2] = newB;
            }

            // Обновление изображения
            hsvImage = new WriteableBitmap(originalImage);
            hsvImage.WritePixels(new Int32Rect(0, 0, width, height), pixelData, stride, 0);
            ImageDisplay.Source = hsvImage; 
        }

        // Конвертация RGB в HSV
        private void RGBtoHSV(byte r, byte g, byte b, out double h, out double s, out double v)
        {
            double rNorm = r / 255.0;
            double gNorm = g / 255.0;
            double bNorm = b / 255.0;

            double max = Math.Max(rNorm, Math.Max(gNorm, bNorm));
            double min = Math.Min(rNorm, Math.Min(gNorm, bNorm));

            h = 0;
            s = (max == 0) ? 0 : (max - min) / max;
            v = max;

            if (max == min)
            {
                h = 0;
            }
            else if (max == rNorm)
            {
                h = (60 * ((gNorm - bNorm) / (max - min)) + 360) % 360;
            }
            else if (max == gNorm)
            {
                h = (60 * ((bNorm - rNorm) / (max - min)) + 120) % 360;
            }
            else if (max == bNorm)
            {
                h = (60 * ((rNorm - gNorm) / (max - min)) + 240) % 360;
            }
        }

        // Конвертация HSV обратно в RGB
        private void HSVtoRGB(double h, double s, double v, out byte r, out byte g, out byte b)
        {
            int i = (int)(h / 60) % 6;
            double f = h / 60 - Math.Floor(h / 60);

            double p = v * (1 - s);
            double q = v * (1 - f * s);
            double t = v * (1 - (1 - f) * s);

            double rNorm = 0, gNorm = 0, bNorm = 0;

            switch (i)
            {
                case 0:
                    rNorm = v;
                    gNorm = t;
                    bNorm = p;
                    break;
                case 1:
                    rNorm = q;
                    gNorm = v;
                    bNorm = p;
                    break;
                case 2:
                    rNorm = p;
                    gNorm = v;
                    bNorm = t;
                    break;
                case 3:
                    rNorm = p;
                    gNorm = q;
                    bNorm = v;
                    break;
                case 4:
                    rNorm = t;
                    gNorm = p;
                    bNorm = v;
                    break;
                case 5:
                    rNorm = v;
                    gNorm = p;
                    bNorm = q;
                    break;
            }

            r = (byte)(rNorm * 255);
            g = (byte)(gNorm * 255);
            b = (byte)(bNorm * 255);
        }

        // Метод для сохранения изображения
        private void OnSaveImage(object sender, RoutedEventArgs e)
        {
            if (hsvImage == null) return;

            SaveFileDialog saveFileDialog = new SaveFileDialog();
            saveFileDialog.Filter = "PNG Image|*.png";
            if (saveFileDialog.ShowDialog() == true)
            {
                using (var fileStream = new FileStream(saveFileDialog.FileName, FileMode.Create))
                {
                    PngBitmapEncoder encoder = new PngBitmapEncoder();
                    encoder.Frames.Add(BitmapFrame.Create(hsvImage));
                    encoder.Save(fileStream);
                }
            }
        }
    }
}
