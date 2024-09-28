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
        public MainWindow()
        {
            InitializeComponent();
        }

        // Открытие окна для задания 1
        private void OnTask1Click(object sender, RoutedEventArgs e)
        {
            Task1Window task1Window = new Task1Window();
            task1Window.Show();
        }

        // Открытие окна для задания 2
        private void OnTask2Click(object sender, RoutedEventArgs e)
        {
            Task2Window task2Window = new Task2Window();
            task2Window.Show();
        }

        // Открытие окна для задания 3
        private void OnTask3Click(object sender, RoutedEventArgs e)
        {
            Task3Window task3Window = new Task3Window();
            task3Window.Show();
        }
    }
}
