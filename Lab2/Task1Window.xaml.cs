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
    /// Логика взаимодействия для Task1Window.xaml
    /// </summary>
    public partial class Task1Window : Window
    {
        private BitmapSource originalImage;
        public Task1Window()
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
            if(original == null) return null;
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
        
    }

}
