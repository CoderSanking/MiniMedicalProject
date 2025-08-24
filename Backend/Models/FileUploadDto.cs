namespace MiniMedicalProject.Models
{
    public class FileUploadDto
    {
        public string FileType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public IFormFile File { get; set; } = null!;
    }
}
