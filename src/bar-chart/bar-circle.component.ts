import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { formatLabel } from '../common/label.helper';

@Component({
  selector: 'g[ngx-charts-bar-circle]',
  template: `
    <svg:circle
      alignment-baseline="middle"
      [attr.transform]="transform"
      [attr.cx] = "x+13"
      [attr.cy] = "y-15"
      [attr.r] = "10"
      (click) = "onClick()"
      style="fill: rgb(255, 0, 0); opacity: 1; cursor: 'auto';"></svg:circle>
  `,
  styleUrls: ['./bar-label.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class BarCircleComponent implements OnChanges {

  @Input() value;
  @Input() valueFormatting: any;
  @Input() barX;
  @Input() barY;
  @Input() barWidth;
  @Input() barHeight;
  @Input() orientation;

  @Output() dimensionsChanged: EventEmitter<any> = new EventEmitter();

  element: any;
  x: number;
  y: number;
  horizontalPadding: number = 2;
  verticalPadding: number = 5;
  formatedValue: string;
  transform: string;
  textAnchor: string;

  constructor(element: ElementRef) {
    this.element = element.nativeElement;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.update();
  }

  getSize(): any {
    const h = this.element.getBoundingClientRect().height;
    const w = this.element.getBoundingClientRect().width;
    return { height: h, width: w, negative: this.value < 0 };
  }

  ngAfterViewInit() {
    this.dimensionsChanged.emit(this.getSize());
  }

  onClick() {
    console.log(this.value);
  }

  update(): void {
    if (this.valueFormatting) {
      this.formatedValue = this.valueFormatting(this.value);
    } else {
      this.formatedValue = formatLabel(this.value);
    }

    if (this.orientation === 'horizontal') {
        this.x = this.barX + this.barWidth;
        // if the value is negative then it's on the left of the x0.
        // we need to put the data label in front of the bar
        if (this.value < 0) {
          this.x = this.x - this.horizontalPadding;
          this.textAnchor = 'end';
        } else {
          this.x = this.x + this.horizontalPadding;
          this.textAnchor = 'start';
        }
        this.y = this.barY + this.barHeight / 2;

    } else {
      // orientation must be "vertical"
      this.x = this.barX + this.barWidth / 2;
      this.y = this.barY + this.barHeight;

      if (this.value < 0) {
        this.y = this.y + this.verticalPadding;
        this.textAnchor = 'end';
      } else {
        this.y = this.y - this.verticalPadding;
        this.textAnchor = 'start';
      }
      this.transform = `rotate(-45, ${ this.x } , ${ this.y })`;
    }

  }
}
