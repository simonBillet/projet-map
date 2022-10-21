import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-add-marker',
  templateUrl: './add-marker.component.html',
  styleUrls: ['./add-marker.component.scss']
})
export class AddMarkerComponent implements OnInit {

  public deviceName = '';

  constructor(public dialogRef: MatDialogRef<AddMarkerComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {name: string}) { }

  ngOnInit(): void {
    this.deviceName = this.data.name;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
