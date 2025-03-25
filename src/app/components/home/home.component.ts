import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, ShoppingBag, Package, Truck, Shield, HelpCircle } from 'lucide-angular';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  bag = ShoppingBag;
  package = Package;
  truck = Truck;
  shield = Shield;
  help = HelpCircle;

}