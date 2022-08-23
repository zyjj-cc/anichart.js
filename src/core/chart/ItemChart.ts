import { Ani } from '../..'
import { Component } from '../component/Component'
import { Stage } from '../Stage'
import { BaseChart, BaseChartOptions } from './BaseChart'
interface ItemChartOptions extends BaseChartOptions {
  style?: string
}
export class ItemChart extends BaseChart {
  constructor (options: ItemChartOptions = {}) {
    super(options)
  }

  setup (stage: Stage, ani: Ani) {
    super.setup(stage, ani)
  }

  getComponent (sec: number): Component {
    const components = this.data.map((item) => {
      // const id = item[this.idField];
      // const value = item[this.valueField];
      return new Component({ key: item.id })
    })
    const res = new Component({
      key: 'item-chart',
    })
    res.children = components
    return res
  }
}
