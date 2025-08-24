using Microsoft.EntityFrameworkCore;
using MiniMedicalProject.Models;
namespace MiniMedicalProject.Data
{
   
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<FileRecord> Files { get; set; }
    }

}
