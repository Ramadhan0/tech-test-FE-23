'use client'

import { useEffect, useState } from 'react'
import styled from 'styled-components'
import covertDate from './utils/convertdates'

interface PayOut {
  dateAndTime: string;
  status: string;
  username: string;
  value: string;
}

const Main = styled.main`
  padding: 24px 10%;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background-color: white;
`;

const Payouts = styled.h3`
  font-family: Inter;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 48px; /* 120% */
  letter-spacing: -0.8px;
`;
const PayOutsTitleContainer = styled.div`
  display: flex;
  gap: 1%;
`;
const PayoutsHistoryBar = styled.div`
  width: 20px;
  height: 32px;
  border-radius: 4px;
  background: #999dff;
`;
const PayOutsTitle = styled.div`
  color: #1a1d1f;

  font-family: Inter;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 32px; /* 160% */
  letter-spacing: -0.4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Hd = styled.td`
  color: #6f767e;
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: 12px;
  letter-spacing: -0.12px;
  padding: 16px 24px;
`;

const Hr = styled.tr`
  background: #ffffff;
`;
const Thead = styled.thead`
  background-color: white;
`;

const Tbody = styled.tbody`
  background-color: #ffffff;
`;
const Tr = styled.tr`
  padding: 16px 24px;
  background: #fcfcfc;
`;

const Td = styled.td`
  color: #6f767e;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.14px;
  padding: 16px 24px;
`;

const SearchContainer = styled.div`
  margin: 2% 0;
`;

const SearchBar = styled.input`
  width: 25%;
  height: 30px;
  border-radius: 5px;
  border: 2px solid #c6c6c6;
`;

const StatusContainer = styled.div`
  display: flex;
  width: fit-content;
  padding: 0 15px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
`;

const Status = styled.p`
  color: #1a1d1f;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 24px;
  letter-spacing: -0.14px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2%;
  overflow: auto;
`

const Pagination = styled.div`
  display: flex;
  width: fit-content;
  padding: 6px 10px;
  margin: 0 0.5%;
  justify-content: center;
  border-radius: 2px;
  background-color: #d8d8d8;
  cursor: pointer;
`

const Page = styled.p`
  color: #1a1d1f;
  text-align: center;
  font-family: Inter;
  font-weight: 600;
  margin: 0;
`

const Home = () => {

  const [loading, setLoading] = useState<Boolean>(true)
  const [payOuts, setPayOuts] = useState([])
  const [pages, setPages] = useState<number[]>([1])
  const [currentPage, setCurrentPage] = useState<number>(1)

  const fetchData = async (url: string, search: boolean) => {
    setLoading(true)
    setPages([1])
    return fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false)

        if (search) return setPayOuts(data)

        console.log(data.metadata)
        const { limit, page, totalCount } = data.metadata
        const numberOfPages = totalCount / limit
        console.log(numberOfPages)
        console.log(Array.from({ length: (Math.floor(numberOfPages) + 1) }, (_, index) => index + 1))
        setCurrentPage(page)
        if (numberOfPages % 1 != 0) setPages(Array.from({ length: (Math.floor(numberOfPages) + 1) }, (_, index) => index + 1))
        else setPages(Array.from({ length: numberOfPages }, (_, index) => index + 1))
        console.log('pages', pages, Math.floor(numberOfPages) + 1, numberOfPages % 1 != 0)
        return setPayOuts(data.data)
      })
  }

  useEffect(() => {
    fetchData(
      'https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts', false
    )
  }, []);

  return (
    <Main>
      <Payouts>Payouts</Payouts>
      <div>
        {/* Tittle */}
        <PayOutsTitleContainer>
          <PayoutsHistoryBar></PayoutsHistoryBar>
          <PayOutsTitle>Payout History</PayOutsTitle>
        </PayOutsTitleContainer>

        {/* Search */}
        <SearchContainer>
          <SearchBar type='text' placeholder='Search payout'
            onChange={(e) => fetchData(`https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/search?query=${e.target.value}`, true)
            }
          />
        </SearchContainer>

        {/* data */}
        <div>
          {!loading ? payOuts.length ? (
            <Table>
              <Thead>
                <Hr>
                  <Hd>Username</Hd>
                  <Hd>Value</Hd>
                  <Hd>Status</Hd>
                  <Hd>Date & Time</Hd>
                </Hr>
              </Thead>
              <Tbody>
                {payOuts.map((payOut: PayOut, index) => (
                  <Tr
                    key={index}
                    style={
                      index % 2
                        ? { background: 'white' }
                        : { background: '#f2f2f2' }
                    }>
                    <Td>{payOut.username}</Td>
                    <Td>{payOut.value}</Td>
                    <Td>
                      <StatusContainer
                        style={
                          payOut.status === 'Pending'
                            ? { background: '#6f767e', color: '#1a1d1f' }
                            : { background: '#60ca57', color: '#1a1d1f' }
                        }>
                        <Status>
                          {payOut.status === 'Completed'
                            ? 'Paid'
                            : payOut.status}
                        </Status>
                      </StatusContainer>
                    </Td>
                    <Td>{covertDate(payOut.dateAndTime)}</Td>
                  </Tr>
                )
                )}
              </Tbody>
            </Table>
          ) : 'no Payouts found' : (
            'Loading ...'
          )}
        </div>
      </div>

      <PaginationContainer>
        {pages.length > 1 && pages.map((page, index) => (
          <Pagination key={index}
            style={
              (index + 1) === currentPage
                ? { background: '#60ca57' }
                : { background: '#dbdbdb' }
            }
            onClick={() => fetchData(
              `https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts?page=${page}`, false
            )}
          >
            <Page>{page}</Page>
          </Pagination>
        ))}

      </PaginationContainer>

    </Main>
  );
};

export default Home;
