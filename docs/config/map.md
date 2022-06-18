# Map Chart Configuration

## MapChart.labelAlphaScale

`d3.ScaleLinear<number, number, never>`

default: `d3.scaleLinear([400, 560], [0, 1]).clamp(true)`

The transparency of the label is calculated from the area of the corresponding area of the map. This function inputs an area and outputs the transparency of the label, in the range 0 to 1.

## MapChart.labelPadding

`number`

default: `8`

This option is used to control the padding size of the label.

## MapChart.labelSize

`number`

default: `12`

This option is used to control the size of the label.

## MapChart.pathShadowBlur

`number`

default: `100`

This option is used to control the size of the map area shadows.

## MapChart.pathShadowColor

`string`

default: `"#fff2"`

This option is used to control the color of the map area shadows.

## MapChart.useShadow

`boolean`

default: `false`

This option is used to control whether to use the map area shadows.

## MapChart.showGraticule

`boolean`

default: `false`

This option is used to control whether to show the graticule.

## MapChart.projectionType

`"orthographic" | "natural" | "mercator" | "equirectangular"`

default: `"natural"`

This option is used to control the type of the map projection.

## MapChart.mapIdField

`string`

default: `"alpha3Code"`

This option is used to control the field name of the map ID. This property is read from the properties of the map GeoJSON.

## MapChart.strokeStyle

`string`

default: `"#fff"`

This option is used to control the color of the map area borders.

## MapChart.defaultFill

`string | CanvasGradient | CanvasPattern`

default: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L0 20H10L20 10V0Z" fill="#4444"/><path d="M10 0H0V10L10 0Z" fill="#4444"/></svg>

This property is used to control the padding of areas that have no data. By default, the background of the stripe is filled.

## MapChart.noDataLabel

`string | undefined`

default: `undefined`

If this option is not undefined, regions with no data will not display the name, but the value of this field will be used instead.

## MapChart.showLabel

`boolean`

default: `true`

This option is used to control whether to show the name of the map area.