# Bar Chart Options

The bar chart is the most common type of chart. It was also the first chart to be supported.

## BarChart.domain

`(data: any[]) => [number, number]`

default: `undefined`

This option is a function, and the incoming option is a list containing the data for each entry of the current frame. This function returns an array of length 2, which is the domain of the chart.

If this option is not given, the minimum value is fixed at `0` and the maximum value is **the maximum of all current values**.

## BarChart.dy

`number`

default: `0`

This option is used to fine-tune the position of some text.

Since the project supports different fonts, and there are some problems with calculating the height of different fonts, which can lead to less beautiful display. This problem can be solved by adjusting the value of `dy`.

## BarChart.barFontSizeScale

`number`

default: `0.9`

This option is used to fine-tune the font size of the text.

Since the project supports different fonts, and there are some problems with calculating the height of different fonts, which can lead to less beautiful display. This problem can be solved by adjusting the value of `barFontSizeScale`.

## BarChart.itemCount

`number`

default: `20`

This option is used to define the number of items showing in the bar chart.

## BarChart.barPadding

`number`

default: `8`

This option defined the left padding of the bars.

## BarChart.barGap

`number`

default: `8`

This option defined the gap between the bars.

## BarChart.clipBar

`boolean`

default: `true`

This option defines whether the information on bars are clipped.

If `true`, the information on the bar will not go beyond the bar.

## BarChart.barInfoFormat

`(id: string, meta: Map<string, any>, data: Map<string, any>) => string`

default:

``` ts
(id: any, meta: Map<string, any>, data: Map<string, any>) => {
  return this.labelFormat(id, meta, data);
};
```

This option defines the format of the information on the bar.

By default, the same value as `labelFormat` is returned.

## BarChart.showDateLabel

`boolean`

default: `true`

This option defines whether to show the date label.

## BarChart.dateLabelOptions

`TextOptions`

By default, the data label will show the current date and will be displayed in the bottom left corner. The position is calculated automatically based on the chart shape and size.

## BarChart.showRankLabel

`boolean`

default: `false`

This option is used to control whether the ranking of the current entry is displayed in front of the entry.

## BarChart.barInfoOptions

`TextOptions`

Used to control the style of the message on the bar.

## BarChart.swapDurationMS

`number`

default: `300`

This option defines the duration of the animation.
