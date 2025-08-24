using MiniMedicalProject.Models;
using System.Text.Json.Serialization;

namespace MiniMedicalProject.Models
{
   
        public class FileRecord
        {
            public int Id { get; set; }
            public int UserId { get; set; }
            public string FileType { get; set; } = string.Empty;
            public string FileName { get; set; } = string.Empty;
            public string FilePath { get; set; } = string.Empty;
            public DateTime CreatedAt { get; set; } = DateTime.Now;

            [JsonIgnore] 
            public User User { get; set; } = null!;
        }
    }






