import { Component, Inject, OnInit } from "@angular/core"
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog"

type DialogData = {
  type: "confirm" | "warn"
  title: string | null
  content: string | null
  confirmBtnText: string
  cancelBtnText: string
}

export type ConfirmDialogData = Partial<DialogData>

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm.component.html",
  styleUrls: ["./confirm.component.scss"],
})
export class ConfirmDialogComponent implements OnInit {
  data: DialogData = {
    type: "confirm",
    title: "Confirm action",
    content: "Are you sure?",
    confirmBtnText: "OK",
    cancelBtnText: "Cancel",
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private initData: ConfirmDialogData,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}

  ngOnInit(): void {
    Object.assign(this.data, this.initData)
  }

  close(confirmed: boolean) {
    this.dialogRef.close(confirmed)
  }
}
