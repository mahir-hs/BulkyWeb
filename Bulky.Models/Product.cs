﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace Bulky.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        [Required]
        public string ISBN { get; set; } = string.Empty;
        [Required]
        public string Author { get; set; } = string.Empty;

        [Required]
        [Range(1, 10000)]
        [DisplayName("List Price")]
        public double ListPrice { get; set; }
        [Required]
        [Range(1, 10000)]
        [DisplayName("Price for 1-50")]
        public double Price { get; set; }
        [Required]
        [Range(1, 10000)]
        [DisplayName("Price for 50+")]
        public double Price50 { get; set; }
        [Required]
        [Range(1, 10000)]
        [DisplayName("Price for 100+")]
        public double Price100 { get; set; }
        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        [ValidateNever]
        public Category Category { get; set; }
        [ValidateNever]
        public string ImageUrl { get; set; } = string.Empty;
     

       
    }
}
