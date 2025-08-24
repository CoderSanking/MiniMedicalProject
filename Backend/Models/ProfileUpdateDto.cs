using System.ComponentModel.DataAnnotations;

namespace MiniMedicalProject.Models
{
    public class ProfileUpdateDto
    {
        public string? FullName { get; set; }
        public string? Gender { get; set; }
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits.")]
        public string? Phone { get; set; }
        public IFormFile? ProfileImage { get; set; }
    }

}
