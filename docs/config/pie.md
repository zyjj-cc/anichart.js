# Pie Chart Configuration

Options for pie charts are included here.

## PieChart.radius

`[number, number]`

default: `[0, 120]`

The inner and outer radius of the pie chart. If the inner radius is not 0, the generated chart is a donut chart.

## PieChart.labelTextStyle

`TextOptions`

default:

``` ts
{
  font: "Sarasa Mono SC",
  lineWidth: 6,
  fontSize: 24,
  fontWeight: "bolder",
  strokeStyle: "#1e1e1e",
}
```

Controls the label style of the pie chart.

## PieChart.showDateLabel

`boolean`

default: `false`

This option defines whether to show the date label.

## PieChart.cornerRadius

`number`

default: `4`

This option controls the size of the rounded corners of each item in the pie chart.

## PieChart.padAngle

`number`

default: `5`

This option sets the pad angle of the pie chart.

## PieChart.minRadio

`number`

default: `0`

This option defines the minimum radius of the pie chart.
