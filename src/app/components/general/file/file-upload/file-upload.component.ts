import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../dialog/confirm-dialog/confirm-dialog.component';
import { FileService } from 'src/app/services/general/file/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {
  _fileName = '';
  selectedFile: File | null = null;
  uploadProgress = 0;
  uploadInProgress = false;

  constructor(public dialog: MatDialog, private fileService: FileService,
    private snackBar: MatSnackBar) {

  }
  onUpload() {
    if (this.selectedFile) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          console.log('Confirmed upload:', this.selectedFile);

          // Set upload in progress and reset progress value
          this.uploadInProgress = true;
          this.uploadProgress = 4;

          if (this.selectedFile) {
            this.fileService.uploadFile(this.selectedFile, this._fileName).subscribe(event => {

            if (event.type === HttpEventType.UploadProgress) {
              // Calculate and update the upload progress
              this.uploadProgress = event.total ? (event.loaded / event.total) * 100 : 0;
            } else if (event.type === HttpEventType.Response) {
              // Handle the response from the server for a successful upload
              console.log('Upload successful', event.body);

              // Reset the progress bar and indicate that upload is complete
              this.uploadInProgress = false;
              this.uploadProgress = 0;

              // Display a success message
              this.snackBar.open('File uploaded successfully!', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
              });
            }
          }, error => {
            console.error('Upload failed', error);

            // Reset the progress bar and indicate that upload is complete
            this.uploadInProgress = false;
            this.uploadProgress = 0;

            // Display an error message
            this.snackBar.open('Failed to upload file!', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
            });
          });
        }
      }
      });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.fileName = this.selectedFile.name; // Update the filename input if a file is selected
    }
  }

  set fileName(value: string) {
    this._fileName = value;
    if (this.selectedFile) {
      this.selectedFile = new File([this.selectedFile], this._fileName, { type: this.selectedFile.type });
    }
  }

  get fileName(): string {
    return this._fileName;
  }
}
