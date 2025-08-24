using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using MiniMedicalProject.Data;
using MiniMedicalProject.Models;

namespace MiniMedicalProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] 
    public class UserController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;  

        public UserController(AppDbContext context, IWebHostEnvironment env)  
        {
            _context = context;
            _env = env;
        }

        // GET: api/User/Profile
        [HttpGet("Profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("Invalid token");

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound("User not found");

            return Ok(new
            {
                user.FullName,
                user.Email,
                user.Gender,
                user.Phone,
                user.ProfileImagePath   // ✅ Include image in GET too
            });
        }

        // PUT: api/User/Profile 
        [HttpPut("Profile")]
        public async Task<IActionResult> UpdateProfile([FromForm] ProfileUpdateDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("Invalid token");

            var user = await _context.Users.FindAsync(int.Parse(userId));
            if (user == null) return NotFound("User not found");

            user.FullName = dto.FullName;
            user.Gender = dto.Gender;
            user.Phone = dto.Phone;

           
            if (dto.ProfileImage != null && dto.ProfileImage.Length > 0)
            {
                var uploadsFolder = Path.Combine(_env.ContentRootPath, "ProfileImages");
                if (!Directory.Exists(uploadsFolder))
                    Directory.CreateDirectory(uploadsFolder);

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(dto.ProfileImage.FileName)}";
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await dto.ProfileImage.CopyToAsync(stream);
                }

                user.ProfileImagePath = $"/ProfileImages/{fileName}";
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Profile updated!",
                user.FullName,
                user.Email,
                user.Gender,
                user.Phone,
                user.ProfileImagePath
            });
        }
    }
}
