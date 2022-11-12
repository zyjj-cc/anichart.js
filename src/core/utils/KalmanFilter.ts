/**
* KalmanFilter
* @class
* @author Wouter Bulten
* @see {@link https://github.com/wouterbulten/kalmanjs}
* @version Version: 1.0.0-beta
* @copyright Copyright 2015-2018 Wouter Bulten
* @license MIT License
* @preserve
*/

export interface KalmanFilterOptions {
  R?: number
  Q?: number
  A?: number
  B?: number
  C?: number
}
export default class KalmanFilter {
  R: number
  Q: number
  A: number
  C: number
  B: number
  cov: number
  x: number
  /**
  * Create 1-dimensional kalman filter
  * @param  {Number} options.R Process noise
  * @param  {Number} options.Q Measurement noise
  * @param  {Number} options.A State vector
  * @param  {Number} options.B Control vector
  * @param  {Number} options.C Measurement vector
  */
  constructor ({ R = 0, Q = 1000, A = 1, B = 0, C = 1 }: KalmanFilterOptions) {
    this.R = R // noise power desirable
    this.Q = Q // noise power estimated
    this.A = A
    this.C = C
    this.B = B
    this.cov = NaN
    this.x = NaN // estimated signal without noise
  }

  /**
  * Filter a new value
  * @param  {Number} z Measurement
  * @param  {Number} u Control
  * @return {Number}
  */
  filter (z: number, u: number = 0): number {
    if (isNaN(this.x)) {
      this.x = (1 / this.C) * z
      this.cov = (1 / this.C) * this.Q * (1 / this.C)
    } else {
      // Compute prediction
      const predX = this.predict(u)
      const predCov = this.uncertainty()

      // Kalman gain
      const K = predCov * this.C * (1 / ((this.C * predCov * this.C) + this.Q))

      // Correction
      this.x = predX + K * (z - (this.C * predX))
      this.cov = predCov - (K * this.C * predCov)
    }

    return this.x
  }

  /**
  * Predict next value
  * @param  {Number} [u] Control
  * @return {Number}
  */
  predict (u: number = 0): number {
    return (this.A * this.x) + (this.B * u)
  }

  /**
  * Return uncertainty of filter
  * @return {Number}
  */
  uncertainty (): number {
    return ((this.A * this.cov) * this.A) + this.R
  }

  /**
  * Return the last filtered measurement
  * @return {Number}
  */
  lastMeasurement (): number {
    return this.x
  }

  /**
  * Set measurement noise Q
  * @param {Number} noise
  */
  setMeasurementNoise (noise: number) {
    this.Q = noise
  }

  /**
  * Set the process noise R
  * @param {Number} noise
  */
  setProcessNoise (noise: number) {
    this.R = noise
  }
}
