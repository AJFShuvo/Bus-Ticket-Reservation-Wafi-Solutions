using Application.DTOs;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces;
public interface IJourneyRepository
{
    Task<List<Journey>> SearchJourneysAsync (string from, string to, DateTime date);
}