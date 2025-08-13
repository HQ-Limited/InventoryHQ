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
    public class CustomerGroupService
    {
        private readonly InventoryHQDbContext _data;
        private readonly IMapper _mapper;

        public CustomerGroupService(InventoryHQDbContext data, IMapper mapper)
        {
            _data = data;
            _mapper = mapper;
        }

        public async Task<CustomerGroupDto?> GetById(int id)
        {
            var customerGroup = await _data.CustomerGroup
                                .Where(x => x.Id == id)
                                .Include(x => x.Customers)
                                .FirstOrDefaultAsync();

            return _mapper.Map<CustomerGroupDto>(customerGroup);
        }

        public async Task<IEnumerable<CustomerGroupDto>> GetCustomerGroups()
        {
            var data = await _data.CustomerGroup
                            .Include(x => x.Customers)
                            .ToListAsync();

            var customerGroups = _mapper.Map<IEnumerable<CustomerGroupDto>>(data);

            return customerGroups;
        }

        public async Task<int?> CreateCustomerGroup(CustomerGroupDto customerGroupDto)
        {
            var customerGroup = _mapper.Map<CustomerGroup>(customerGroupDto);
            await _data.CustomerGroup.AddAsync(customerGroup);

            await _data.SaveChangesAsync();

            return customerGroup.Id;
        }

        public async Task<int?> UpdateCustomerGroup(CustomerGroupDto customerGroupDto)
        {
            var customerGroup = await _data.CustomerGroup.FirstAsync(x => x.Id == customerGroupDto.Id);

            if (customerGroup == null)
            {
                return null;
            }

            _mapper.Map(customerGroupDto, customerGroup);

            await _data.SaveChangesAsync();
            return customerGroup.Id;
        }

        public async Task<int?> DeleteCustomerGroup(int id)
        {
            var customerGroup = await _data.CustomerGroup.FirstOrDefaultAsync(x => x.Id == id);

            if (customerGroup == null)
            {
                return null;
            }

            _data.CustomerGroup.Remove(customerGroup);
            await _data.SaveChangesAsync();

            return customerGroup.Id;
        }
    }
}
