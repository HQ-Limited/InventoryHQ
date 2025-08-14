using AutoMapper;
using AutoMapper.QueryableExtensions;
using InventoryHQ.Data;
using InventoryHQ.Data.Models;
using InventoryHQ.Extensions;
using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace InventoryHQ.Services
{
    public class SupplierService
    {
        private readonly InventoryHQDbContext _data;
        private readonly IMapper _mapper;

        public SupplierService(InventoryHQDbContext data, IMapper mapper)
        {
            _data = data;
            _mapper = mapper;
        }

        public async Task<SupplierDto?> GetById(int id)
        {
            var data = await _data.Suppliers
                .Select(c => new SupplierDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    PMR = c.PMR,
                    Phone = c.Phone,
                    Email = c.Email,
                    VAT = c.VAT,
                    TaxVAT = c.TaxVAT,
                    Address = c.Address,
                })
                .Where(x => x.Id == id)
                .FirstOrDefaultAsync();

            return data;
        }

        public async Task<IEnumerable<PricelistDto>> GetPricelist(int id)
        {
            var data = await _data.Pricelists
                .Include(x => x.Variation)
                    .ThenInclude(x => x.Product)
                .Where(x => x.SupplierId == id)
                .ToListAsync();

            var pricelist = _mapper.Map<IEnumerable<PricelistDto>>(data);

            return pricelist;
        }

        public async Task<IEnumerable<SupplierDto>> GetSuppliers()
        {
            var data = await _data.Suppliers
                .Where(x => x.Deleted == false)
                .ToListAsync();

            var suppliers = _mapper.Map<IEnumerable<SupplierDto>>(data);

            return suppliers;
        }

        public async Task<int?> CreateSupplier(SupplierDto supplierDto)
        {
            var supplier = _mapper.Map<Supplier>(supplierDto);
            await _data.Suppliers.AddAsync(supplier);

            await _data.SaveChangesAsync();

            return supplier.Id;
        }

        public async Task<int?> UpdateSupplier(SupplierDto supplierDto)
        {
            var supplier = await _data.Suppliers.FirstAsync(x => x.Id == supplierDto.Id);

            if (supplier == null)
            {
                return null;
            }

            _mapper.Map(supplierDto, supplier);

            await _data.SaveChangesAsync();
            return supplier.Id;
        }

        public async Task<int?> DeleteSupplier(int id)
        {
            var supplier = await _data.Suppliers.FirstOrDefaultAsync(x => x.Id == id);

            if (supplier == null)
            {
                return null;
            }

            // TODO: When creating RESTOCK CRUD, check if supplier is used in any restock. If so, do not delete but set Deleted to true.

            _data.Suppliers.Remove(supplier);
            await _data.SaveChangesAsync();

            return supplier.Id;
        }
    }
}
