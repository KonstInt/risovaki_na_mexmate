using Microsoft.Win32;
using System;
using System.Linq;
using System.Windows;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Controls;

namespace Lab2
{
    public partial class Task1Window : Window
    {
        private BitmapSource originalImage;
        private BitmapSource grayscaleImage1;
        private BitmapSource grayscaleImage2;

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

        // Преобразование изображения в оттенки серого
        private BitmapSource ConvertToGrayscale(BitmapSource original, bool useAltFormula)
        {
            if (original == null) return null;
            int width = original.PixelWidth;
            int height = original.PixelHeight;
            int stride = (width * original.Format.BitsPerPixel + 7) / 8;
            byte[] pixelData = new byte[height * stride];
            original.CopyPixels(pixelData, stride, 0);

            for (int i = 0; i < pixelData.Length; i += 4)
            {
                byte r = pixelData[i + 2]; // Красный
                byte g = pixelData[i + 1]; // Зеленый
                byte b = pixelData[i];     // Синий
                byte gray;

                if (useAltFormula)
                {
                    // Альтернативная формула
                    gray = (byte)((r + g + b) / 3);
                }
                else
                {
                    // Классическая формула
                    gray = (byte)(0.299 * r + 0.587 * g + 0.114 * b);
                }

                pixelData[i] = gray;     // Синий компонент
                pixelData[i + 1] = gray; // Зеленый компонент
                pixelData[i + 2] = gray; // Красный компонент
            }

            return BitmapSource.Create(width, height, original.DpiX, original.DpiY, original.Format, original.Palette, pixelData, stride);
        }

        // Метод для расчета разности между двумя полутоновыми изображениями
        private BitmapSource CalculateDifference(BitmapSource img1, BitmapSource img2)
        {
            int width = img1.PixelWidth;
            int height = img1.PixelHeight;
            int stride = (width * img1.Format.BitsPerPixel + 7) / 8;
            byte[] pixels1 = new byte[height * stride];
            byte[] pixels2 = new byte[height * stride];
            byte[] resultPixels = new byte[height * stride];

            img1.CopyPixels(pixels1, stride, 0);
            img2.CopyPixels(pixels2, stride, 0);

            for (int i = 0; i < pixels1.Length; i += 4)
            {
                byte gray1 = pixels1[i];
                byte gray2 = pixels2[i];
                byte difference = (byte)Math.Abs(gray1 - gray2);

                resultPixels[i] = difference;
                resultPixels[i + 1] = difference;
                resultPixels[i + 2] = difference;
                resultPixels[i + 3] = 255; // Альфа-канал (прозрачность)
            }

            return BitmapSource.Create(width, height, img1.DpiX, img1.DpiY, img1.Format, img1.Palette, resultPixels, stride);
        }

        // Метод для рисования гистограммы
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

        // Обработчик для кнопки "Convert to Grayscale"
        private void OnConvertToGrayscale(object sender, RoutedEventArgs e)
        {
            if (originalImage == null)
            {
                LoadImage();
            }

            // Преобразование изображения в два разных полутоновых варианта
            grayscaleImage1 = ConvertToGrayscale(originalImage, false); // Классическая формула
            grayscaleImage2 = ConvertToGrayscale(originalImage, true);  // Альтернативная формула

            // Вычисление разности изображений
            BitmapSource differenceImage = CalculateDifference(grayscaleImage1, grayscaleImage2);

            // Отображение изображений и разницы
            GrayscaleImage1Display.Source = grayscaleImage1;
            GrayscaleImage2Display.Source = grayscaleImage2;
            DifferenceImageDisplay.Source = differenceImage;

            // Построение гистограмм для каждого изображения
            DrawHistogram(grayscaleImage1, Histogram1Display, 0, Colors.Gray); // Для первого изображения
            DrawHistogram(grayscaleImage2, Histogram2Display, 0, Colors.Gray); // Для второго изображения
        }
    }
}
