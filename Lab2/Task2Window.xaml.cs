using Microsoft.Win32;
using System;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace Lab2
{
    public partial class Task2Window : Window
    {
        private BitmapSource originalImage; // Оригинальное изображение в RGB

        public Task2Window()
        {
            InitializeComponent();
        }

        private void LoadImage()
        {
            OpenFileDialog openFileDialog = new OpenFileDialog
            {
                Filter = "Image files (*.png;*.jpeg;*.jpg)|*.png;*.jpeg;*.jpg"
            };
            if (openFileDialog.ShowDialog() == true)
            {
                originalImage = new BitmapImage(new Uri(openFileDialog.FileName));
            }
        }

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
                pixelData[i] = (channelIndex == 0) ? value : (byte)0; // R
                pixelData[i + 1] = (channelIndex == 1) ? value : (byte)0; // G
                pixelData[i + 2] = (channelIndex == 2) ? value : (byte)0; // B
                // Устанавливаем альфа-канал в 255
                pixelData[i + 3] = 255;
            }
            return BitmapSource.Create(width, height, original.DpiX, original.DpiY, original.Format, original.Palette, pixelData, stride);
        }

        private void OnExtractChannels(object sender, RoutedEventArgs e)
        {
            LoadImage();

            // Выделяем цветовые каналы
            BitmapSource redChannelImage = ExtractChannel(originalImage, 0);
            BitmapSource greenChannelImage = ExtractChannel(originalImage, 1);
            BitmapSource blueChannelImage = ExtractChannel(originalImage, 2);

            // Устанавливаем изображения каналов
            RedChannelImage.Source = redChannelImage;
            GreenChannelImage.Source = greenChannelImage;
            BlueChannelImage.Source = blueChannelImage;

            // Создаем гистограммы
            DrawHistogram(redChannelImage, RedHistogram, 0, Colors.Red);
            DrawHistogram(greenChannelImage, GreenHistogram, 1, Colors.Green);
            DrawHistogram(blueChannelImage, BlueHistogram, 2, Colors.Blue);
        }

        private void DrawHistogram(BitmapSource channelImage, Image histogramImage, int channelIndex, Color histogramColor)
        {
            int width = 256;
            int height = 200;
            int[] histogram = new int[width];

            int stride = (channelImage.PixelWidth * channelImage.Format.BitsPerPixel + 7) / 8;
            byte[] pixelData = new byte[channelImage.PixelHeight * stride];
            channelImage.CopyPixels(pixelData, stride, 0);

            // Подсчёт значений гистограммы
            for (int i = 0; i < pixelData.Length; i += 4)
            {
                int value = pixelData[i + channelIndex];
                histogram[value]++;
            }

            int maxHistogramValue = histogram.Max(); // Максимальное значение для нормализации

            // Создаем bitmap для гистограммы и осей
            var histogramBitmap = new WriteableBitmap(width, height, 96, 96, PixelFormats.Bgra32, null);
            byte[] histogramData = new byte[width * height * 4]; // Память под пиксели

            // Рисуем столбцы гистограммы
            for (int x = 0; x < width; x++)
            {
                int normalizedHeight = (int)(histogram[x] / (double)maxHistogramValue * height);

                for (int y = 0; y < normalizedHeight; y++)
                {
                    int index = (x + (height - y - 1) * width) * 4; // Строим столбец снизу вверх
                    histogramData[index + 0] = histogramColor.B;  // B
                    histogramData[index + 1] = histogramColor.G; // G
                    histogramData[index + 2] = histogramColor.R;  // R
                    histogramData[index + 3] = 255; // A
                }
            }

            histogramBitmap.WritePixels(new Int32Rect(0, 0, width, height), histogramData, width * 4, 0);

            // Создаём визуальный элемент для текста и осей
            DrawingVisual visual = new DrawingVisual();
            using (DrawingContext drawingContext = visual.RenderOpen())
            {
                // Рисуем гистограмму
                drawingContext.DrawImage(histogramBitmap, new Rect(30, 10, width, height));

                // Добавляем текст для осей
                Typeface typeface = new Typeface("Arial");

                // Подписываем ось X: 0, 128, 255
                drawingContext.DrawText(
                    new FormattedText("0", System.Globalization.CultureInfo.InvariantCulture, FlowDirection.LeftToRight, typeface, 12, Brushes.Black),
                    new System.Windows.Point(30, height + 15));
                drawingContext.DrawText(
                    new FormattedText("128", System.Globalization.CultureInfo.InvariantCulture, FlowDirection.LeftToRight, typeface, 12, Brushes.Black),
                    new System.Windows.Point(width / 2 + 30, height + 15));
                drawingContext.DrawText(
                    new FormattedText("255", System.Globalization.CultureInfo.InvariantCulture, FlowDirection.LeftToRight, typeface, 12, Brushes.Black),
                    new System.Windows.Point(width + 25, height + 15));

                // Подписываем ось Y максимальным значением
                drawingContext.DrawText(
                    new FormattedText(maxHistogramValue.ToString(), System.Globalization.CultureInfo.InvariantCulture, FlowDirection.LeftToRight, typeface, 12, Brushes.Black),
                    new System.Windows.Point(0, 10));

                // Линии осей
                Pen axisPen = new Pen(Brushes.Black, 1);
                drawingContext.DrawLine(axisPen, new System.Windows.Point(30, 10), new System.Windows.Point(30, height + 10)); // Y ось
                drawingContext.DrawLine(axisPen, new System.Windows.Point(30, height + 10), new System.Windows.Point(width + 30, height + 10)); // X ось
            }

            // Преобразуем всё в изображение
            RenderTargetBitmap renderBitmap = new RenderTargetBitmap(width + 40, height + 40, 96, 96, PixelFormats.Pbgra32);
            renderBitmap.Render(visual);

            // Присваиваем гистограмму с осями Image
            histogramImage.Source = renderBitmap;
        }



    }
}
