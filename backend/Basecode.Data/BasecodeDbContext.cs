using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Basecode.Data.Models;

namespace Basecode.Data
{
    public partial class BasecodeDbContext : DbContext
    {
        //public AsiBasecodeDBContext()
        //{
        //}

        public BasecodeDbContext(DbContextOptions<BasecodeDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
