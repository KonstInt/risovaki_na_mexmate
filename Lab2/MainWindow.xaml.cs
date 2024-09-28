using Microsoft.Win32;
using System;
using System.Collections.Generic;
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
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Lab2
{
    /// <summary>
    /// Логика взаимодействия для MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private BitmapSource originalImage; // Хранение оригинального изображения

        public MainWindow()
        {
            InitializeComponent();
        }

        // Метод для загрузки изображения
        private void LoadImage()
        {
            OpenFileDialog openFileDialog = new OpenFileDialog
            {
                Filter = "Image files (*.png;*.jpeg;*.jpg)|*.png;*.jpeg;*.jpg"
            };

            if (openFileDialog.ShowDialog() == true)
            {
                originalImage = new BitmapImage(new Uri(openFileDialog.FileName));
                ImageDisplay.Source = originalImage;
            }
        }

        // Преобразование изображения в оттенки серого двумя способами
        private BitmapSource ConvertToGrayscale(BitmapSource original, bool useAltFormula)
        {
            int width = original.PixelWidth;
            int height = original.PixelHeight;
            int stride = (width * original.Format.BitsPerPixel + 7) / 8;
            byte[] pixelData = new byte[height * stride];
            original.CopyPixels(pixelData, stride, 0);

            for (int i = 0; i < pixelData.Length; i += 4)
            {
                byte r = pixelData[i];
                byte g = pixelData[i + 1];
                byte b = pixelData[i + 2];
                byte gray;

                if (useAltFormula)
                {
                    gray = (byte)((r + g + b) / 3);
                }
                else
                {
                    gray = (byte)(0.299 * r + 0.587 * g + 0.114 * b);
                }

                pixelData[i] = gray;
                pixelData[i + 1] = gray;
                pixelData[i + 2] = gray;
            }

            return BitmapSource.Create(width, height, original.DpiX, original.DpiY, original.Format, original.Palette, pixelData, stride);
        }

        // Выделение одного из каналов (R, G, B)
        private BitmapSource ExtractChannel(BitmapSource original, int channelIndex)
        {
            int width = original.PixelWidth;
            int height = original.PixelHeight;
            int stride = (width * original.Format.BitsPerPixel + 7) / 8;
            byte[] pixelData = new byte[height * stride];
            original.CopyPixels(pixelData, stride, 0);

            for (int i = 0; i < pixelData.Length; i += 4)
            {
                byte value = pixelData[i + channelIndex];
                pixelData[i] = (channelIndex == 0) ? value : (byte)0;
                pixelData[i + 1] = (channelIndex == 1) ? value : (byte)0;
                pixelData[i + 2] = (channelIndex == 2) ? value : (byte)0;
            }

            return BitmapSource.Create(width, height, original.DpiX, original.DpiY, original.Format, original.Palette, pixelData, stride);
        }

        // Преобразование RGB в HSV и обратно
        private void RGBtoHSV(byte r, byte g, byte b, out double h, out double s, out double v)
        {
            // Преобразование из RGB в HSV
            double rD = r / 255.0;
            double gD = g / 255.0;
            double bD = b / 255.0;
            double max = Math.Max(rD, Math.Max(gD, bD));
            double min = Math.Min(rD, Math.Min(gD, bD));
            v = max;

            double delta = max - min;
            s = max == 0 ? 0 : delta / max;

            if (delta == 0)
            {
                h = 0;
            }
            else if (max == rD)
            {
                h = (gD - bD) / delta + (gD < bD ? 6 : 0);
            }
            else if (max == gD)
            {
                h = (bD - rD) / delta + 2;
            }
            else
            {
                h = (rD - gD) / delta + 4;
            }
            h *= 60;
        }

        private void HSVtoRGB(double h, double s, double v, out byte r, out byte g, out byte b)
        {
            // Преобразование из HSV в RGB
            double c = v * s;
            double x = c * (1 - Math.Abs((h / 60) % 2 - 1));
            double m = v - c;

            double rD = 0, gD = 0, bD = 0;
            if (0 <= h && h < 60) { rD = c; gD = x; }
            else if (60 <= h && h < 120) { rD = x; gD = c; }
            else if (120 <= h && h < 180) { gD = c; bD = x; }
            else if (180 <= h && h < 240) { gD = x; bD = c; }
            else if (240 <= h && h < 300) { rD = x; bD = c; }
            else { rD = c; bD = x; }

            r = (byte)((rD + m) * 255);
            g = (byte)((gD + m) * 255);
            b = (byte)((bD + m) * 255);
        }

        // Обработчик для кнопки "Convert to Grayscale"
        private void OnConvertToGrayscale(object sender, RoutedEventArgs e)
        {
            if (originalImage == null)
            {
                LoadImage();
            }

            // Выбор формулы
            bool useAltFormula = false; // Это можно контролировать через UI (например, через CheckBox)
            BitmapSource grayscaleImage = ConvertToGrayscale(originalImage, useAltFormula);
            ImageDisplay.Source = grayscaleImage;
        }

        // Обработчик для кнопки "Extract Channels"
        private void OnExtractChannels(object sender, RoutedEventArgs e)
        {
            if (originalImage == null)
            {
                LoadImage();
            }

            // Выбираем канал (0 = R, 1 = G, 2 = B)
            int channelIndex = 0; // Это можно контролировать через UI (например, ComboBox или RadioButton)
            BitmapSource channelImage = ExtractChannel(originalImage, channelIndex);
            ImageDisplay.Source
            = channelImage;
        }

        // Обработчик для кнопки "Adjust HSV"
        private void OnAdjustHSV(object sender, RoutedEventArgs e)
        {
            if (originalImage == null)
            {
                LoadImage();
            }

            // Чтение значений ползунков
            double hue = HueSlider.Value;
            double saturation = SaturationSlider.Value;
            double value = ValueSlider.Value;

            int width = originalImage.PixelWidth;
            int height = originalImage.PixelHeight;
            int stride = (width * originalImage.Format.BitsPerPixel + 7) / 8;
            byte[] pixelData = new byte[height * stride];
            originalImage.CopyPixels(pixelData, stride, 0);

            for (int i = 0; i < pixelData.Length; i += 4)
            {
                byte r = pixelData[i];
                byte g = pixelData[i + 1];
                byte b = pixelData[i + 2];

                RGBtoHSV(r, g, b, out double h, out double s, out double v);

                // Применение значений от ползунков
                h = hue;
                s = saturation;
                v = value;

                HSVtoRGB(h, s, v, out r, out g, out b);

                pixelData[i] = r;
                pixelData[i + 1] = g;
                pixelData[i + 2] = b;
            }

            BitmapSource hsvAdjustedImage = BitmapSource.Create(width, height, originalImage.DpiX, originalImage.DpiY, originalImage.Format, originalImage.Palette, pixelData, stride);
            ImageDisplay.Source = hsvAdjustedImage;
        }
    }
}
