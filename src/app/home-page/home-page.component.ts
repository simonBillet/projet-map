import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import {MatDialog} from "@angular/material/dialog";
import {AddMarkerComponent} from "../dialog/add-marker/add-marker.component";
import {Device} from "../model/device";
import {DomEvent} from "leaflet";
import stopPropagation = DomEvent.stopPropagation;
import {formatDate} from "@angular/common";
import MarkersJson from '../../assets/markers.json';
//import * as $ from 'jquery';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  public devices: Device[] = [];
  public map!: L.Map;
  private icon = {
    icon: L.icon({
      iconSize: [ 36, 36 ],
      iconAnchor: [ 13, 0 ],
      // specify the path here
      iconUrl: './assets/pin.png'
    })
  }
  public showListMarker: boolean = false;

  constructor(private dialog:MatDialog) {
  }

  ngOnInit(): void {
    this.map = L.map('map').setView([47.2055874, -1.5488164], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.map.on('dblclick', (event => {
      this.openDialog(event);
    }));

    for (const device of MarkersJson.markers) {
      this.createMarker(device.name, device.latlng, new Date(device.date), device.id)
    }
  }

  openDialog(event: L.LeafletMouseEvent): void {
    const dialogRef = this.dialog.open(AddMarkerComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){
        this.createMarker(result, event.latlng)
      }

    })
  }

  createMarker(name: string, latlng: any, date?: Date, id?: number) {
    const marker = L.marker(latlng, this.icon);
    marker.addTo(this.map);

    const device: Device = {
      "id": id?? Math.round(Math.random()*100000000000),
      "name": name,
      "date": date?? new Date(),
      "latlng": latlng
    };

    marker.on('click', (e => {
      stopPropagation(e);
      const popUpContent = `
             <div style="display: flex; flex-direction: column">
                <span style="font-weight: bold">Détail de l'objet</span>
                <span>Name: ${device.name}</span>
                <span>Date : ${formatDate(device.date, 'mediumDate', 'en-US')}</span>
                <button id="removeMarker" mat-raised-button color="warn">Supprimer</button>
            </div>`;

      L.popup()
        .setLatLng(marker.getLatLng())
        .setContent(popUpContent)
        .openOn(this.map);
    }))

    this.devices.push(device);
  }

  modifierMarker(device: Device) {
    const dialogRef = this.dialog.open(AddMarkerComponent, {
      data: { name: device.name },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined){
        device.name = result;
      }

    })
  }

  supprimerMarker(device: Device){
    const index = this.devices.indexOf(device);
    this.devices.splice(index,1);

    L.control.layers().remove();
  }
}
