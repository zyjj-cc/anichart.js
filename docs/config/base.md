# Base Chart Options

All other chart options will inherit from the base chart options. Some general options that can be used for multiple charts are provided here.

## BaseChart.aniTime

`[number, number]`

default: `undefined`

Defines the start and end time of the animation.

This option takes into account the need to have some fixed frames at the beginning and at the end of the animated chart.

For example, if this option is set to `[5, 10]`, the animation will start at the 5th second and stop at the 10th second.

If the value of this option is undefined, then it is defined as `[0, max]`. where max is the animation time defined in stage.

## BaseChart.interpolateInitValue

`number`

default: `NaN`

Defines how to insert data when interpolating. Generally defined as NaN, i.e. if there is a missing value, a NaN is inserted.

## BaseChart.fadeTime

`[number, number]`

default: `undefined`

If this option is defined, then the chart will fade in and out at the start and end of the animation.

## BaseChart.freezeTime

`[number, number]`

default: `undefined`

If this option is defined, then the chart will freeze at the start and end of the animation.

## BaseChart.idField

`string`

default: `"id"`

Defines the field name that distinguishes each entry. The default is `id`.

## BaseChart.colorField

`string`

default: `"id"`

Defines the field name that determines the color of each entry. The default is `id`.

In some cases, such as visualizing players for certain competitions, it might be better to color them according to their nationality field.

## BsaeChart.dateField

`string`

default: `"date"`

Define the field name that describes the time.

## BaseChart.valueField

`string`

default: `"value"`

Defines the name of the field that describes the value.

## BaseChart.imageField

`string`

default: `"id"`

Defined the field name that describes the image. Sometimes we can add an image to an entry, and this option can determine which field to select an image based on.

## BaseChart.maxIntervalMS

`number`

default: `Number.MAX_VALUE`

This option defines the maximum interval time.

If the interval of data is greater than the maximum interval time, the data will disappear from the graph. If the data interval is less than the maximum interval time, the data will be interpolated.

This number is in milliseconds.

## BaseChart.dataFadeMS

`number`

default: `1000`

This option defines the fade in and fade out times required for data entry and exit. Currently this option should only be in effect in BarChart.

## BaseChart.shape

`{ weight: number, height: number }`

default: `undefined`

If this option is defined, the chart height and width will be set to the specified values.

If not defined, it will automatically fit and spread the height and width of the stage.

## BaseChart.position

`{ x: number, y: number }`

default: `[0, 0]`

If this option is defined, the chart will be positioned at the specified coordinates.

## BaseChart.dateFormat

`string`

default: `"%Y-%m-%d"`

This option defines the format of the date.

## BaseChart.valueKeys

`string[]`

default: `["value"]`

Specifies the fields in the data table that need to be converted to numbers.

## BaseChart.margin

`{ top: number, right: number, bottom: number, left: number }`

default: `{top: 0, right: 0, bottom: 0, left: 0}`

This option defines the margin of the chart.

## BaseChart.xTickFormat

`(n: number | { valueOf(): number }) => string`

default: `d3.format(",d")`

This option defines the format of the x-axis tick. By default, the value format function of d3 is called.

## BaseChart.yTickFormat

`(n: number | { valueOf(): number }) => string`

default: `d3.format(",d")`

This option defines the format of the x-axis tick. By default, the value format function of d3 is called.

## BaseChart.showAxis

`boolean`

default: `true`

This option defines whether to show the axis.

## BaseChart.showXAxis

`boolean`

default: `true`

This option defines whether to show the x-axis. The priority is lower than showAxis.

## BaseChart.showYAxis

`boolean`

default: `true`

This option defines whether to show the y-axis. The priority is lower than showAxis.

## BaseChart.valueFormat

`(data: object) => string`

default: `(d) => d3.format(",.0f")(d[this.valueField])`

This option defines the format of the value.

By default, the value of the field specified by valueField is read, and no decimals are retained.

## BaseChart.labelFormat

`(id: string, meta?: Map<string, object>, data?: object[]) => string`

default:

``` js
(
  id: string,
  meta?: Map<string, any>,
  data?: any
) => {
  if (meta && meta.get(id) && meta.get(id).name) {
    return meta.get(id).name;
  } else {
    return id;
  }
}
```

This option is used to format the label and requires passing in a function with three parameters, `id`, `meta` and `data`.

The `id` is specified by this.idField. `meta` is a data table named meta and is converted into a dictionary form to make it easier to read additional information for each entry. `data` is the data for each entry at the current point in time.

## BaseChart.metaName

`string`

default: `"meta"`

Specifies the table name of the meta information table. The default is "meta".

## BaseChart.dataName

`string`

default: `"data"`

Specifies the table name of the data table. The default is "data".

## BaseChart.visualRange

`"total" | "current" | "history" | [number, number]`

default: `current`

Only used in map and bar Chart.

This option defines the visual map range of the chart.

The default is `current`, which means that the range of the visual map is between the maximum and minimum of all current values.

If it is `history`, the value of the visual map will be between the maximum and minimum of all values that have appeared in the past.

If it is `total`, the visual map will range between the maximum and minimum values of all past and future values.

This option can also be passed an array of values of length 2, with the first value being a fixed minimum and the second value being a fixed maximum.
