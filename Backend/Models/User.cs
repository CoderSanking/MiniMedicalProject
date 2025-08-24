using System.ComponentModel.DataAnnotations;

namespace MiniMedicalProject.Models
{
    public class User
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        [EmailAddress(ErrorMessage = "Invalid email address format.")]
        public string Email { get; set; } = string.Empty;
        public string Gender { get; set; } = string.Empty;
        public string? ProfileImagePath { get; set; }  
        [RegularExpression(@"^\d{10}$", ErrorMessage = "Phone number must be exactly 10 digits.")]
        public string Phone { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;
    }

}
