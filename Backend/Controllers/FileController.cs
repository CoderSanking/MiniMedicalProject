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
    public class FilesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;

        public FilesController(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

      
        [HttpPost]
        public async Task<IActionResult> UploadFile([FromForm] FileUploadDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("Invalid token");

            if (dto.File == null || dto.File.Length == 0)
                return BadRequest("File is missing");

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "Uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var storedFileName = Guid.NewGuid().ToString() + Path.GetExtension(dto.File.FileName);
            var filePath = Path.Combine(uploadsFolder, storedFileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await dto.File.CopyToAsync(stream);
            }

            var fileRecord = new FileRecord
            {
                UserId = int.Parse(userId),
                FileType = dto.FileType,
                FileName = dto.FileName,      
                FilePath = storedFileName,   
                CreatedAt = DateTime.UtcNow
            };

            _context.Files.Add(fileRecord);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "File uploaded successfully",
                fileRecord.Id,
                fileUrl = $"/uploads/{storedFileName}"
            });
        }

  
        [HttpGet]
        public async Task<IActionResult> GetFiles()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("Invalid token");

            var files = await _context.Files
                .Where(f => f.UserId == int.Parse(userId))
                .Select(f => new
                {
                    f.Id,
                    f.FileType,
                    f.FileName,
                    fileUrl = $"/uploads/{f.FilePath}", 
                    f.CreatedAt
                })
                .ToListAsync();

            return Ok(files);
        }

    
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized("Invalid token");

            var file = await _context.Files.FirstOrDefaultAsync(f => f.Id == id && f.UserId == int.Parse(userId));
            if (file == null) return NotFound("File not found");

          
            var fullPath = Path.Combine(_env.ContentRootPath, "Uploads", file.FilePath);
            if (System.IO.File.Exists(fullPath))
                System.IO.File.Delete(fullPath);

            _context.Files.Remove(file);
            await _context.SaveChangesAsync();

            return Ok(new { message = "File deleted successfully" });
        }
    }
}
