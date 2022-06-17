# Bar chart

The bar chart is the most common type of chart. It was also the first chart to be supported.

## BarChart.domain

`(data: any[]) => [number, number]` default: `undefined`

This parameter is a function, and the incoming parameter is a list containing the data for each entry of the current frame. This function returns an array of length 2, which is the domain of the chart.

If this parameter is not given, the minimum value is fixed at `0` and the maximum value is **the maximum of all current values**.

## BarChart.dy

`number`, default: `0`

This parameter is used to fine-tune the position of some text.

Since the project supports different fonts, and there are some problems with calculating the height of different fonts, which can lead to less beautiful display. This problem can be solved by adjusting the value of `dy`.

## BarChart.barFontSizeScale

`number`, default: `0.9`

This parameter is used to fine-tune the font size of the text.

Since the project supports different fonts, and there are some problems with calculating the height of different fonts, which can lead to less beautiful display. This problem can be solved by adjusting the value of `barFontSizeScale`.
